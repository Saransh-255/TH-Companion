import React, { useState } from "react";
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

import { useHover, useInteractions, useFloating, safePolygon } from "@floating-ui/react";
import { Scrape } from "@brainly";
import shortDelRsn from "@lib/shortDelRsn";

export default function UserData({ user, userId, data }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const { x, y, strategy, refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
  });
  
  const hover = useHover(context, {
    delay: {
      open: 300,
      close: 200,
    },
    handleClose: safePolygon({
      buffer: 1,
    }),
  });
  
  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
  ]);

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
              <>
                <div ref={refs.setReference} {...getReferenceProps()}>
                  <Icon type="warning" color="icon-yellow-60" size={24} />
                </div>
                {
                  isOpen && (
                    <Box
                      ref={refs.setFloating}
                      style={{
                        position: strategy,
                        top: y > 0 ? y : 0,
                        left: x > 0 ? x : 0,
                        zIndex: "999",
                        width:"400px",
                        minHeight:"160px"
                      }}
                      {...getFloatingProps()}
                      color="white"
                      padding="m"
                      border
                      tabIndex={2}
                    >
                      <Warnings id={user.id} />
                    </Box>
                  )
                }
              </>
            ) : (
              <Text weight="bold">[0]</Text>
            )
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
  const [loading, setLoading] = React.useState(true);
  const [warnings, setWarnings] = React.useState([]);
  React.useEffect(
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

  if (warnings.length && !loading) {
    return (
      <Flex 
        className="scroll-container" 
        direction="column" 
        style={{ gap: "4px", overflow:"auto", maxHeight: "300px", height: "100%" }}
      >
        {
          warnings.map(warn => {
            return <WarnItem warn={warn} />;
          })
        }
      </Flex>
    );
  } else {
    return (
      <SpinnerContainer style={{ height:"150px" }} fullWidth loading />
    );
  }
}
function WarnItem({ warn }) {
  const [expand, setExpand] = React.useState(false);

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
          <Text size="small">{warn.reason}</Text>
        ) : ""
      }

    </Box>
  );
}