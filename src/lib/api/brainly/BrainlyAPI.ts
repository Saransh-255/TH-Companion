import type {
  CommonResponse,
  GetQuestionResponse,
  ReportData,
  ReferenceData,
  PreviewData
} from "@typings/brainly";

export default new class BrainlyAPI {
  private legacyURL = `https://brainly.com/api/28`;
  private graphURL = `https://brainly.com/graphql/us`;
  private tokenLong: string;

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
  async ReportReasons(id: number, type: "task" | "response"):Promise<ReportData> {
    const MODEL_ID = {
      "task" : 1,
      "response" : 2
    };
    return await fetch("https://brainly.com/api/28/moderation_new/get_abuse_reasons", {
      method: "POST",
      body: JSON.stringify({
        model_id: id,
        model_type_id: MODEL_ID[type]
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
  async ReportContent(data: {
    id: number, 
    type: "task" | "response",
    categoryId: number,
    subId?: number,
    data?: string
  }) {
    const MODEL_ID = {
      "task" : 1,
      "response" : 2
    };

    return await fetch("https://brainly.com/api/28/api_moderation/abuse_report", {
      method: "POST",
      body: JSON.stringify({
        abuse: {
          category_id: data.categoryId,
          subcategory_id: data.subId ?? null,
          data: data.data ?? null
        },
        model_id: data.id,
        model_type_id: MODEL_ID[data.type],
      })
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
};