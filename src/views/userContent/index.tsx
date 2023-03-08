import { Scrape, Legacy } from "@brainly";
import CompanionAPI from "@api/companion/index";

import createPage from "@lib/createPage";
import { Sidebar } from "@reactComponents";
import { ReferenceData } from "@typings/brainly";
import { Flex, Box } from "brainly-style-guide";
import React from "react";

import Head from "./_head";
import ContentList from "./_contentList";

const thisUser = CompanionAPI.SavedData();

if (thisUser.isModerator) createPage((
  <Flex style={{ height:"100vh" }}>
    <Sidebar />
    <Content />
  </Flex>
), "User Content");

let dataStr = window.location.href.replace("https://brainly.com/companion/user/", "").split("/");
let id = dataStr[0];
function Content() {
  const [userInfo, setUser] = React.useState<{avatar: string, nick: string}>();
  const [dref, setdRef] = React.useState<ReferenceData>();

  const [page, setPage] = React.useState(1);
  const [type, setType] = React.useState("solved");

  const [lastPage, setLast] = React.useState(false);
  const [load, setLoad] = React.useState(false);
  
  React.useEffect(() => {
    const UserInfo = async () => {
      await Scrape.getUser(id).then(data => setUser(data));
      await Legacy.ReferenceData().then(data => setdRef(data));
    };
    UserInfo();
  }, []);

  
  if (userInfo?.nick && dref) {
    return (
      <Box padding="s">
        <Flex direction="column" style={{ height:"100%", flex: "1" }}>
          <Head 
            setType={setType}
            isLast={lastPage}
            type={type}
            user={userInfo} 
            page={page} 
            setPage={setPage} 
            load={load}
          />
          <ContentList
            dref={dref}
            setLast={setLast}
            userId={id}
            type={type}
            page={page}
            setLoad={setLoad}
          />

          <div className="comp-messages-container"></div>

        </Flex>
      </Box>
    );
  }
}