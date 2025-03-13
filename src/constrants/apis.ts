
export const apis = {
    follow:{
        getAll:()=>'/get-all',
        getById:(uid:string)=>`/get-byId?uid=${uid}`,
        // updateFollowEvent:()=>'/update-follower-event',
        updateFollowCategory:()=>'/update-follower-category',
        updateFollowUserOther:()=>'/update-follower-userOther',

    },
    user:{
        getById:(uid:string)=>`/get-user-byId?uid=${uid}`,
        getAll:()=>`/get-all`,
        updatePositionUser:()=>`/update-position-user`,
        updateFcmToken:()=>`/update-fcmtoken`,
        updateProfile:()=>`/update-profile`,
        getEventInterestedByIdUser:({idUser}:{idUser:string})=>`/get-event-interested-byIdUser?idUser=${idUser}`,
        addHistorySearch:()=>`/add-history-search`,
        deleteHistorySearch:()=>`/delete-history-search`,
        updateHistorySearch:()=>`/update-history-search`,   
        checkInDaily:()=>`/check-in-daily`
    },
    notification:{
        handleSendNotificationInviteUserToEvent:()=>`/invite-users-to-event`,
        getAll:()=>`/get-all`,
        getNotificationsById:({idUser,typeFillter,statusFillter,limit}:{idUser:string,typeFillter?:string,statusFillter?:string,limit?:string})=>{
            const params = new URLSearchParams();
            if (idUser !== undefined) params.append('idUser', idUser);
            if (typeFillter !== undefined) params.append('typeFillter', typeFillter);
            if (statusFillter !== undefined) params.append('statusFillter', statusFillter);
            if (limit !== undefined) params.append('limit', limit);
            return `/get-notifications-byId?${params.toString()}`
        },
        updateisViewdNotifications:()=>`/update-isViewed-notifitions`,
        deleteNotifications:()=>`/delete-notifications`,
        // updateStatusNotifications:()=>`/update-status-notifitions`,

    },
    auth:{
        login:()=>`/login`,
        register:()=>`/register`,
        verification:()=>`/verification`,
        forgotPassword:()=>`/forgotPassword`,
        verificationForgotPassword:()=>`/verificationForgotPassword`,
        updatePassword:()=>`/updatePassword`

    },
    
    event:{
        getById:(eid:string)=>`/get-event-byId?eid=${eid}`,
        getAll:({lat,long,distance,limit,limitDate,searchValue,categoriesFilter,keywordsFilter,startAt,endAt,minPrice,maxPrice,sortType}:
    {lat?:string,long?:string,distance?:string,limit?:string,limitDate?:string
        ,searchValue?:string,categoriesFilter?:string[],keywordsFilter?:string[],startAt?:string,endAt?:string,minPrice?:string,maxPrice?:string,sortType?:'view'})=>{
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
                if (sortType  !== undefined) params.append('sortType', sortType );
                if (categoriesFilter !== undefined) {
                    categoriesFilter.forEach(category => {
                        params.append('categoriesFilter', category);
                    });
                }
                if (keywordsFilter !== undefined) {
                    keywordsFilter.forEach(keyword => {
                        params.append('keywordsFilter', keyword);
                    });
                }
                return `/get-events?${params.toString()}`;
            },
            addEvent:()=>`/get-all`,
            updateFollowEvent:()=>`/update-followers`,
            updateEvent:()=>`/update-event`,
            incViewEvent:()=>`/incView-event`,
            getDescriptionEvent:({idEvent}:{idEvent:string})=>`/get-description-byIdEvent?idEvent=${idEvent}`,
            getShowTimesEvent:({idEvent}:{idEvent:string})=>`/get-showTimes-byIdEvent?idEvent=${idEvent}`
            
    },
    category:{
        addCategory:()=>`/add-category`,
        getAll:()=>`/get-all`,
    },
    organizer:{
        getAll:({limit}:{limit?:string})=>`/get-all?limit=${limit}`
    },
    invoice:{
        createInvoice:()=>`/create-paymentInvoiceTicket`,
        cancelInvoice:()=>`/cancel-invoice`,
        getByIdUser:({idUser,searchValue,filterMonthTime}:{idUser?:string,searchValue?:string,filterMonthTime?:string})=>{
            const params = new URLSearchParams();
            if (idUser !== undefined) params.append('idUser', idUser);
            if (searchValue !== undefined) params.append('searchValue', searchValue);
            if (filterMonthTime !== undefined) params.append('filterMonthTime', filterMonthTime);

            return `/get-byIdUser?${params.toString()}`
        }

    },
    ticket:{
        reserveTicket:()=>`/reserve-ticket`,
        getByIdUser:({uid,typeFilter}:{uid?:string,typeFilter?:'UpComing'|'Ended'|'Canceled'})=>{
            const params = new URLSearchParams();
            if (uid !== undefined) params.append('idUser', uid);
            if (typeFilter !== undefined) params.append('typeFilter', typeFilter);
            return `/get-byIdUser?${params.toString()}`
        },
        getByIdInvoice:({idInvoice}:{idInvoice:string})=>`/get-byIdInvoice?idInvoice=${idInvoice}`
    },
    keyword:{
        getAll:()=>'/get-all'
    },
    comment:{
        commentEvent:()=>`/comment-event`,
        replyCommentEvent:()=>`/replyComment-event`,
        getByIdEvent:({idEvent,idUser,idAuthor}:{idEvent:string,idUser:string,idAuthor:string})=>`/get-byIdEvent?idEvent=${idEvent}&idUser=${idUser}&idAuthor=${idAuthor}`,
        deleteComment:()=>`/delete-comment`,
    }   

}