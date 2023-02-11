import { useState } from "react";
import Head from "./Components/_head";
import createModal from "@lib/createModal";
import Item from "./Components/_item";
import BrainlyAPI from "@lib/api/brainly/BrainlyAPI";
import showLoading from "@lib/showLoading";
import flashMsg from "@lib/flashMsg";
import CmtDel from "./Components/_cmtDel";

export default async function showTicket(id:string) {
  if (document.querySelector(".loading-ext#prev")) return;
  let ticket, dRef;
  await showLoading("Fetching Data", "prev", async () => {
    try {
      ticket = await BrainlyAPI.OpenTicket(id);
    } catch (err) {
      return flashMsg(err + "", "error");
    }
    dRef = await BrainlyAPI.ReferenceData();
  });

  createModal({
    element: <Ticket ticket={ticket} id={id} dRef={dRef} />,
    className: "preview ticket",
    minWidth: "575px",
    maxWidth: "600px",
    closeFn: () => {
      BrainlyAPI.CloseTicket(id);
    }
  });
}

function Ticket({ ticket, id, dRef }) {
  const [delArr, addComment] = useState([]);
  const [delLoading, setLoading] = useState(false);

  let subject = dRef.data.subjects.find(({ id }) => id === ticket.data.task.subject_id).name;
  let grade = dRef.data.grades.find(({ id }) => id === ticket.data.task.grade_id).name;

  return (
    <>
      <Head subject={subject} grade={grade} id={id} data={ticket.data.task} />
      <div className="items scroll-container" style={{ flex: "1", overflow: "auto" }}>

        <Item id={id} ticket={ticket} users={ticket.users_data} data={ticket.data.task} type="task"
          delArr={delArr}
          changeArr={addComment} 
        />
        {
          ticket.data.responses.map(({ id }, index) => {
            return (
              <Item
                id={id}
                ticket={ticket}
                key={index}
                users={ticket.users_data}
                data={ticket.data.responses[index]}
                type="response"
                delArr={delArr}
                changeArr={addComment} />
            );
          })
        }
      </div>
      {
        delArr.length ? (
          <CmtDel delArr={delArr} delLoading={delLoading} setLoading={setLoading} ticket={ticket} />
        ) : ""
      }
    </>
  );
}