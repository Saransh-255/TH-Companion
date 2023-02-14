import type {
  CommonResponse,
  GetQuestionResponse,
  ReportData,
  ReferenceData,
  PreviewData,
  UserInfo,
  ContentList,
  Notifications,
  GetQuestionLogResponse,
  TicketData
} from "@typings/brainly";

export default new class BrainlyAPI {
  private legacyURL = `https://brainly.com/api/28`;
  private graphURL = `https://brainly.com/graphql/us`;
  private tokenLong: string;
  private MODEL_ID = {
    "task" : 1,
    "response" : 2,
    "comment": 45
  };

  constructor() {
    this.SetAuthToken();
  }
  private SetAuthToken() {
    let cookie = document.cookie.split("; ").find(cookie => /\[Token\]\[Long\]/i.test(cookie));
    this.tokenLong = cookie?.split("=")?.pop();
  }

  private async Legacy<T>(
    method: "GET" | "POST",
    apiMethod: string,
    body?
  ): Promise<CommonResponse<T>> {
    const res = await fetch(`${this.legacyURL}/${apiMethod}`, {
      method,
      body: method === "GET" ? null : JSON.stringify(body)
    }).then(data => data.json());
      
    if (!res.success) throw Error(res.message || "error");
      
    return res;
  }

  private async GQL(
    query: string, 
    variables?
  ) {
    return await fetch(this.graphURL, {
      method: "POST",
      body: JSON.stringify({ query, variables }),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "X-B-Token-Long": this.tokenLong
      }
    }).then(data => data.json());
  }

  public async GetQuestion(id: number): Promise<GetQuestionResponse> {
    return await this.Legacy("GET", `api_tasks/main_view/${id}`);
  }
  async ReportReasons(id: number, type: "task" | "response" | "comment"):Promise<ReportData> {
    return await fetch("https://brainly.com/api/28/moderation_new/get_abuse_reasons", {
      method: "POST",
      body: JSON.stringify({
        model_id: id,
        model_type_id: this.MODEL_ID[type]
      })
    }).then(data => data.json()).then(data => data);
  }
  async ReferenceData():Promise<ReferenceData> {
    return await fetch("https://brainly.com/api/28/api_config/desktop_view")
      .then(data => data.json());
  }
  async PreviewData(id:string):Promise<PreviewData> {
    return await fetch(`https://brainly.com/api/28/api_tasks/main_view/${id}`)
      .then(data => data.json());
  }
  async MyData():Promise<UserInfo> {
    return await fetch(`https://brainly.com/api/28/api_users/me`).then(data => data.json());
  }
  async GetContent(type: "tasks" | "responses"):Promise<ContentList> {
    return await fetch(`https://brainly.com/api/28/api_${type}/view_list`, 
      {
        method: "POST", 
        body: JSON.stringify({ 
          limit: 10000, 
          last_id: null })
      }).then(data => data.json());
  }
  async GetNotifications():Promise<Notifications> {
    return await fetch("https://brainly.com/api/28/api_notifications/view", 
      {
        method: "POST", 
        body: JSON.stringify({
          last_id: null, 
          limit: 500
        })
      }).then(data => data.json());
  }
  async ReportContent(data: {
    id: number, 
    type: "task" | "response" | "comment",
    categoryId: number,
    subId?: number,
    data?: string
  }) {

    let res = await fetch("https://brainly.com/api/28/api_moderation/abuse_report", {
      method: "POST",
      body: JSON.stringify({
        abuse: {
          category_id: data.categoryId,
          subcategory_id: data.subId ?? null,
          data: data.data ?? null
        },
        model_id: data.id,
        model_type_id: this.MODEL_ID[data.type],
      })
    }).then(data => data.json());
    return res.success ? res : null;
  }
  async Approve(id:string) {
    await this.Legacy(`POST`, "api_content_quality/confirm", {
      "model_type": 2,
      "model_id": id
    });
  }
  async UploadImage() {
    let img = new Blob([], { type: "image/png" });

    let form = new FormData();
    form.append("model_type_id", "2");
    form.append("payload", img);
    
    await fetch("https://brainly.com/api/28/api_attachments/upload", {
      method: "POST",
      body: form
    });
  }
  async ForYou(id: string) {
    return this.GQL(
      `query($id:ID!){
        user(id:$id){
          answers{
            edges{
              node{
                question{
                  similar{
                    question{
                      content 
                      id
                      pointsForAnswer
                      attachments{
                        url
                      }
                      canBeAnswered
                      subject{
                        name
                        icon
                      }
                      author{
                        id
                        avatar{
                          thumbnailUrl
                        }
                      }
                      answers{
                        nodes{
                          author{
                            nick
                            id
                          }
                        }
                      }
                    }
                    similarity
                  }
                }
              }
            }
          }
        }
      }`, { "id":btoa(`user:${id}`) }
    );
  }
  async OpenTicket(id:string | number):Promise<TicketData> { 
    return await this.Legacy("POST", "moderation_new/get_content", ({ 
      "model_type_id":1, 
      "model_id":id, 
      "schema":"moderation.content.get" 
    }
    )); 
  }
  async CloseTicket(id:string | number) {
    return await this.Legacy("POST", "moderate_tickets/expire", ({
      "model_type_id":1, 
      "model_id":id, 
      "schema":"moderation.content.expire" 
    }));
  }
  async DeleteContent(data:
    {
      type: "task" | "response" | "comment",
      id:string | number, 
      reasonId: string | number,
      reason:string, 
      warn:boolean, 
      take_point?:boolean,
      return_point?: boolean
    }
  ) {
    return this.Legacy("POST", `moderation_new/delete_${data.type}_content`, ({
      "reason_id":data.reasonId, 
      "reason":data.reason, 
      "give_warning":data.warn, 
      "schema": data.type === "comment" ? "" : `moderation.${data.type}.delete`, 
      "model_type_id": this.MODEL_ID[data.type], 
      "model_id":data.id, 
      ...(data.type !== "comment" ? { "take_points": data.take_point } : {}),
      ...(data.type === "task" ? { "return_points": data.return_point } : {}) 
    }
    ));
  }
  async GetLog(id:string | number):Promise<GetQuestionLogResponse> {
    return await this.Legacy("GET", `/api_task_lines/big/${id}`);
  }
};