import React, { useContext, useState } from 'react';
import { Box, styled, Avatar } from '@mui/material';
import InfoDrawer from './chat/InfoDrawer';
import HeaderMenu from './HeaderMenu';
import { AccountContext } from '../context/AccountProvider';
import GroupsIcon from '@mui/icons-material/Groups';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationModal from './NotificationModal';
import Badge from '@mui/material/Badge';

const Component = styled(Box)({
  height: '10vh',
  background: '#ededed',
  padding: '8px 24px',
  display: 'flex',
  alignItems: 'center',
  color: '#131124',
});

const Wrapper = styled(Box)({
  marginLeft: 'auto',
  display: 'flex',
  alignItems: 'center',
  '& *': {
    padding: '8px 8px', 
    margin: '0 4px',
    cursor: 'pointer',
  },
});

const CustomAvatar = styled(Avatar)({
  cursor: 'pointer',
});

export default function Header() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const { userDetails, groups, setGroups, notification, setSelectedChat, setIsGroupCreate, isGroupCreate } = useContext(AccountContext);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  const handleGroupCreateOpen = () => {
    setIsGroupCreate(!isGroupCreate);
    setSelectedChat();
  };

  const handleNotificationIconClick = () => {
    setIsNotificationModalOpen(true);
  };

  const handleGroupsListToggle = () => {
    setGroups(!groups);
    setSelectedChat();
  };

  return (
    <div>
      <Component>
        {userDetails?.picture && (
          <CustomAvatar
            alt={userDetails?.name}
            src={userDetails?.picture}
            onClick={toggleDrawer}
          />
        )}

        <Wrapper>
          <GroupAddIcon onClick={handleGroupCreateOpen} />
          <GroupsIcon onClick={handleGroupsListToggle} />
          
          <Badge
  badgeContent={notification.length}
  color="primary"
  sx={{ padding:'0px'}} // Adjust the margins as needed
>
  <NotificationsIcon onClick={handleNotificationIconClick} />
</Badge>

          <HeaderMenu setOpenDrawer={setOpenDrawer} />
        </Wrapper>
      </Component>
      <InfoDrawer open={openDrawer} setOpen={setOpenDrawer} />
     
      <NotificationModal open={isNotificationModalOpen} handleClose={() => setIsNotificationModalOpen(false)} />
    </div>
  );
}
