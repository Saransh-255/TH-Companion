import { useState, useEffect } from "react";
import { 
  Media, 
  Avatar, 
  Flex, 
  Icon, 
  Text, 
  Box, 
  SpinnerContainer, 
  Button
} from "brainly-style-guide";
import { format } from "date-fns";

import { Scrape } from "@brainly";
import shortDelRsn from "@lib/shortDelRsn";
import makePopup from "@lib/makePopup";

export default function UserData({ user, userId, data }) {

  return (
    <Media
      noPadding
      small
      className = "sg-flex sg-flex--align-items-center"
      aside={
        <Avatar
          imgSrc={user.avatar?.[64] || null}
          link= {userId}
        />}
      contentArray={[
        <Flex style={{ gap:"4px" }}>
          <Text weight="bold"> {user.nick}</Text>
          {
            data.user.warnings_count ? (
              <Icon 
                type="warning"
                color="icon-yellow-60"
                onClick={
                  ({ target }) => {
                    return (
                      makePopup(target as HTMLElement, <Warnings id={user.id} />)
                    );
                  }
                }
              >
              </Icon>
            ) : (<Text weight="bold">[0]</Text>)
          }
        </Flex>,
            
        <Text
          size="xsmall"
          color="text-gray-50"
        >
          {format(new Date(data.created), "dd/MM/yy HH:mm:ss")}
        </Text>
      ]}
    />
  );
}

function Warnings({ id }) {
  const [loading, setLoading] = useState(true);
  const [warnings, setWarnings] = useState([]);
  useEffect(
    () => {
      Scrape.getWarnings(id).then(data => {
        setWarnings(
          data.filter(
            ({ isRevoked }) => !isRevoked
          )
        );
        setLoading(false);
      });
    }, []
  );
  
  return (
    <Box
      color="white"
      padding="s"
      border
      className="warnpop"
    >
      {
        warnings.length && !loading ? (
          <Flex 
            className="scroll-container" 
            direction="column" 
            style={{ gap: "4px", overflow:"auto", maxHeight: "300px", height: "100%" }}
          >
            {
              warnings.map(warn => {
                return <WarnItem warn={warn} key={warn.date} />;
              })
            }
          </Flex>
        ) : (
          <SpinnerContainer style={{ height:"150px", width: "400px" }} fullWidth loading />
        )
      }
    </Box>
  );
}
function WarnItem({ warn }) {
  const [expand, setExpand] = useState(false);

  return (
    <Box border>
      <Flex justifyContent="space-between">
        <Flex direction="column">
          <Text color="text-black" size="medium" weight="bold" >
            {shortDelRsn(warn.reason)}
          </Text>
          <Text size="small" as="span" color="text-blue-60">
            {warn.moderator}
          </Text>
        </Flex>
        
        <Button 
          variant="transparent"
          icon={
            <Icon type={"arrow_" + (expand ? "up" : "down")} size={24} color="icon-gray-50"> </Icon>
          }
          iconOnly
          size="m"
          onClick={
            () => setExpand(!expand)
          }
        />
      </Flex>
      <Text size="small" color="text-gray-60">{warn.date}</Text>
      {
        expand ? (
          <Text 
            size="small"
            style={{
              overflowWrap: "break-word"
            }}
          >{warn.reason}</Text>
        ) : ""
      }

    </Box>
  );
}