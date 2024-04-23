import React, { useContext, useState } from 'react';
import { Box, styled, Avatar } from '@mui/material';
import InfoDrawer from './chat/InfoDrawer';
import HeaderMenu from './HeaderMenu';
import { AccountContext } from '../context/AccountProvider';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationModal from './NotificationModal';
import Badge from '@mui/material/Badge';
// import Profile from './Profile';

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
  const { userDetails, notification, setSelectedChat, setIsGroupCreate, isGroupCreate } = useContext(AccountContext);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  const handleGroupCreateOpen = () => {
    setIsGroupCreate(!isGroupCreate);
    setSelectedChat();
  };

  const handleNotificationIconClick = () => {
    setIsNotificationModalOpen(true);
  };

  const handleCLick = () => {
    setOpenDrawer(!openDrawer);
  }

  return (
    <div>
      <Component>
      {userDetails?.picture && (
  <CustomAvatar
    alt="User Avatar"
    src={`data:image/svg+xml;base64,${userDetails.picture}`}
    style={{
      width: '40px',
      height: '40px',
      margin: '0 4px',
      cursor: 'pointer',
    }}
    onClick={handleCLick}
  />
)}

        <Wrapper>
          <GroupAddIcon onClick={handleGroupCreateOpen} />
          
          <Badge
  badgeContent={notification.length}
  color="primary"
  sx={{ padding: '0px' }}
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
