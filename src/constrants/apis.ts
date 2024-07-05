
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
        getById:(eid:string)=>`/get-event-byId?eid=${eid}`,
        getAll:({lat,long,distance,limit,limitDate,searchValue}:{lat?:string,long?:string,distance?:string,limit?:string,limitDate?:string,searchValue?:string})=>{
                const params = new URLSearchParams();
                if (lat !== undefined) params.append('lat', lat);
                if (long !== undefined) params.append('long', long);
                if (distance !== undefined) params.append('distance', distance);
                if (limit !== undefined) params.append('limit', limit);
                if (limitDate !== undefined) params.append('limitDate', limitDate);
                if (searchValue !== undefined) params.append('searchValue', searchValue);
                console.log("abcdd",params)
                return `/get-events?${params.toString()}`;
            }
            
    }

}