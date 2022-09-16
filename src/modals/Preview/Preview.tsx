// eslint-disable-next-line @typescript-eslint/no-unused-vars
import react, { useEffect } from "react";
import Head from "./Components/Head";
import createModal from "@lib/createModal";
import Item from "./Components/Item";
import BrainlyAPI from "@lib/api/brainly/BrainlyAPI";

export default async function showPreview(id:string) {
  let data = await BrainlyAPI.PreviewData(id);
  let dRef = await BrainlyAPI.ReferenceData();
  
  let subject = dRef.data.subjects.find(({ id }) => id === data.data.task.subject_id).name;
  let grade = dRef.data.grades.find(({ id }) => id === data.data.task.grade_id).name;

  createModal(
    <>
      <Head subject={subject} grade={grade} id={id} data={data.data.task} />
      <div className="items" style={{ flex:"1", overflow: "auto" }}>

        <Item id={id} users={data.users_data} data={data.data.task} type="task" />
        {data.data.responses.map(({ id }, index) => {
          return (
            <Item
              id={id}
              key={index}
              users={data.users_data}
              data={data.data.responses[index]}
              type="response" />
          );
        })}
      </div></>, "500px", "600px");
}