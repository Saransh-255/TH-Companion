import { useState } from "react";
import Head from "./Components/_head";
import createModal from "@lib/createModal";
import Item from "./Components/_item";
import { Legacy } from "@brainly";
import showLoading from "@lib/showLoading";
import flashMsg from "@lib/flashMsg";
import CmtDel from "./Components/_cmtDel";
import Log from "./Components/_log";
import { GetQuestionLogResponse, PreviewData, ReferenceData, TicketData } from "@typings/brainly";

export default async function showTicket(id:string | number, onClose?: () => void) {
  if (document.querySelector(".loading-ext#prev")) return;

  let error:string;

  let ticket:TicketData, dRef:ReferenceData, log:GetQuestionLogResponse, qData:PreviewData;
  await showLoading("Fetching Data", "prev", async () => {
    try {
      ticket = await Legacy.OpenTicket(id);
      qData = await Legacy.PreviewData(id);
      dRef = await Legacy.ReferenceData();
      log = await Legacy.GetLog(id);
    } catch (err) {
      error = err;
    }

    if (!error) error = ticket.message ?? null;
  });

  if (error) return flashMsg(error, "error");

  createModal({
    element: <Ticket ticket={ticket} id={id} dRef={dRef} log={log} qData={qData} />,
    className: "preview ticket",
    minWidth: "650px",
    maxWidth: "650px",
    closeFn: () => {
      Legacy.CloseTicket(id);
      onClose?.();
    }
  });
}

function Ticket(
  { ticket, id, dRef, log, qData }:
  { ticket: TicketData, id:string | number, dRef:ReferenceData, 
    log:GetQuestionLogResponse, qData:PreviewData }
) {
  const [delArr, addComment] = useState([]);
  const [delLoading, setLoading] = useState(false);

  let subject = dRef.data.subjects.find(({ id }) => id === ticket.data.task.subject_id).name;
  let grade = dRef.data.grades.find(({ id }) => id === ticket.data.task.grade_id).name;

  return (
    <>
      <Head subject={subject} grade={grade} id={id} data={ticket.data.task} />
      <div className="items scroll-container" style={{ flex: "1" }}>

        <Item 
          id={id} 
          ticket={ticket} 
          users={log.users_data} 
          data={ticket.data.task} 
          type="task"
          delArr={delArr}
          changeArr={addComment} 
          qData={qData.data.task}
        />
        {
          ticket.data.responses.map(({ id }, index: number) => {
            return (
              <Item
                id={id}
                ticket={ticket}
                key={index}
                users={log.users_data}
                data={ticket.data.responses[index]}
                type="response"
                delArr={delArr}
                qData={qData.data.responses[index]}
                changeArr={addComment} />
            );
          })
        }

        <Log data={log} />
      </div>

      {
        delArr.length ? (
          <CmtDel 
            delArr={delArr} 
            delLoading={delLoading} 
            setLoading={setLoading} 
            ticket={ticket} 
            addComment={addComment}
          />
        ) : ""
      }
    </>
  );
}