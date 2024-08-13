
export const apis = {
    follow:{
        getAll:()=>'/get-all',
        getById:(uid:string)=>`/get-byId?uid=${uid}`,
        updateFollowEvent:()=>'/update-follower-event',
        updateFollowCategory:()=>'/update-follower-category q',
        updateFollowUserOther:()=>'/update-follower-userOther',

    },
    user:{
        getById:(uid:string)=>`/get-user-byId?uid=${uid}`,
        getAll:(uid:string)=>`/get-all`,
        updatePositionUser:(uid:string)=>`/update-position-user`,
        updateFcmToken:(uid:string)=>`/update-fcmtoken`,
        updateProfile:(uid:string)=>`/update-profile`,

    },
    notification:{
        handleSendNotificationInviteUserToEvent:()=>`/invite-users-to-event`
    },
    auth:{

    },
    event:{
        getById:(eid:string)=>`/get-event-byId?eid=${eid}`,
        getAll:({lat,long,distance,limit,limitDate,searchValue,categoriesFilter,startAt,endAt,minPrice,maxPrice}:
    {lat?:string,long?:string,distance?:string,limit?:string,limitDate?:string
        ,searchValue?:string,categoriesFilter?:string[],startAt?:string,endAt?:string,minPrice?:string,maxPrice?:string})=>{
                const params = new URLSearchParams();
                if (lat !== undefined) params.append('lat', lat);
                if (long !== undefined) params.append('long', long);
                if (distance !== undefined) params.append('distance', distance);
                if (limit !== undefined) params.append('limit', limit);
                if (limitDate !== undefined) params.append('limitDate', limitDate);
                if (searchValue !== undefined) params.append('searchValue', searchValue);
                if (startAt !== undefined) params.append('startAt', startAt);
                if (endAt !== undefined) params.append('endAt', endAt);
                if (minPrice !== undefined) params.append('minPrice', minPrice);
                if (maxPrice  !== undefined) params.append('maxPrice', maxPrice );
                if (categoriesFilter !== undefined) {
                    categoriesFilter.forEach(category => {
                        params.append('categoriesFilter', category);
                    });
                }
                return `/get-events?${params.toString()}`;
            }
            
    }

}