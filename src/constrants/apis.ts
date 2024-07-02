
export const apis = {
    follow:{
        getAll:()=>'/get-all',
        getById:(uid:string)=>`/get-byId?uid=${uid}`
    },
    user:{
        getById:(uid:string)=>`/get-user-byId?uid=${uid}`
    },
    notification:{
        handleSendNotificationInviteUserToEvent:()=>`/invite-users-to-event`
    },
    event:{
        getById:(eid:string)=>`/get-event-byId?eid=${eid}`
    }

}