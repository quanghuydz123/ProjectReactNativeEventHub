import BottomSheet, { BottomSheetFlatList, BottomSheetView } from "@gorhom/bottom-sheet";
import { useFocusEffect } from "@react-navigation/native";
import { useState, useRef, useCallback, forwardRef, useMemo } from "react";
import { TextInput, BackHandler, View, FlatList, StyleSheet, TouchableOpacity, Text } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { SectionComponent, RowComponent, SpaceComponent, TextComponent, InputComponent, ButtonComponent } from "../../../components";
import AvatarItem from "../../../components/AvatarItem";
import CardComponent from "../../../components/CardComponent";
import { appInfo } from "../../../constrants/appInfo";
import { colors } from "../../../constrants/color";
import { fontFamilies } from "../../../constrants/fontFamilies";
import { CommentModel } from "../../../models/CommentModel";
import { UserModel } from "../../../models/UserModel";
import { DateTime } from "../../../utils/DateTime";
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useSelector } from "react-redux";
import { authSelector, AuthState } from "../../../reduxs/reducers/authReducers";
import { apis } from "../../../constrants/apis";
import commentAPI from "../../../apis/commentAPI";
interface Props {
    setIsShowing: (val: boolean) => void,
    setIndex: (val: number) => void,
    // textComment: string,
    // setTextComment: (val: string) => void,
    isShowing: boolean,
    comments:CommentModel[],
    idEvent:string
}

const CommentComponent = forwardRef<any, Props>((props: Props, ref: any) => {
    const { setIsShowing, setIndex, isShowing ,comments,idEvent} = props
    const [isInputFocused, setInputFocused] = useState(false);
    const [textComment, setTextComment] = useState('')
    const auth:AuthState = useSelector(authSelector)
    const flatListRef = useRef<any>()
    const handleSheetChanges = useCallback((index: number) => {
        setIndex(index)
        setIsShowing(index < 1 ? false : true);
        // if (index === -1 && isInputFocused) {
        //     textInputRef.current?.blur();
        // }
    }, []);
    const [selectedCommentReply,setSelectedCommentReply] = useState<{idComment:string,user:{
        _id:string,
        fullname:string,
        photoUrl?:string
    }}>({
        idComment:'',
        user:{
            _id:'',
            fullname:'',
            photoUrl:''
        }
    })
    const textInputRef = useRef<TextInput>(null);

    // useFocusEffect(
    //     useCallback(() => {
    //         const onBackPress = () => {
    //             if (isShowing) {
    //                 bottomSheetRef.current?.close();
    //                 BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    //                 return true;
    //             }
    //         };
    //         BackHandler.addEventListener("hardwareBackPress", onBackPress);
    //         return () =>
    //             BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    //     }, [bottomSheetRef, isShowing])
    // );
    const renderCommentChild = ({comment}:{comment:{
        _id:string,
        user:{
            _id:string,
            fullname:string,
            photoUrl?:string
          },
        content:string,
        createdAt:Date
      }}) => {
        return (
            <RowComponent key={comment._id} styles={{ alignItems: 'flex-start'}}>
               <AvatarItem photoUrl={comment?.user?.photoUrl} size={24} borderWidth={1} colorBorderWidth={colors.gray3} styles={{ marginTop: appInfo.sizes.HEIGHT * 0.008 }} />
               <SpaceComponent width={6} />
                <View style={{flex:1}}>
                    <CardComponent color='#f3f2f7' styles={{alignSelf: 'flex-start'}} >
                        <TextComponent text={comment?.user?.fullname ?? 'Người dùng'} size={14} font={fontFamilies.medium} />
                        <TextComponent text={comment?.content ?? ''} />
                    </CardComponent>
                    <RowComponent styles={{ paddingHorizontal: 8 }}>
                        <TextComponent text={DateTime.getDateTimeMesssage(comment?.createdAt ?? new Date())} color={'#727272'} />
                        {/* <SpaceComponent width={12} />
                        <TextComponent text={'Phản hồi'} font={fontFamilies.medium} color={'#717171'} /> */}
                    </RowComponent>
                    <SpaceComponent height={2} />
                </View>
            </RowComponent>
        )
    }
    const RenderComment = useCallback(({comment}:{comment:CommentModel}) => {
        const [isSeeMore,setIsSeeMore] = useState(false)
        const seeMoreComment = useCallback(() => {
            setIsSeeMore(true);
        }, []);
        return (
            <>  
                <RowComponent key={comment._id} styles={{ alignItems: 'flex-start', paddingHorizontal: 12 }}>
                    <AvatarItem photoUrl={comment?.user?.photoUrl} size={42} borderWidth={1} colorBorderWidth={colors.gray3} styles={{ marginTop: appInfo.sizes.HEIGHT * 0.006 }} />
                    <SpaceComponent width={6} />
                    <View style={{ flex: 1 }}>
                        <CardComponent color='#f3f2f7' styles={{alignSelf: 'flex-start'}}>
                            <TextComponent text={comment.user.fullname ?? 'Người dùng'} size={15} font={fontFamilies.medium} />
                            <TextComponent text={comment.content ?? ''} />
                        </CardComponent>
                        <RowComponent styles={{ paddingHorizontal: 8 }}>
                            {!comment.isLoading ? <>
                                <TextComponent text={DateTime.getDateTimeMesssage(comment?.createdAt ?? new Date())} color={'#727272'} />
                                <SpaceComponent width={12} />
                                <ButtonComponent text={'Phản hồi'} textColor="#717171" onPress={()=>{
                                    
                                    setSelectedCommentReply({
                                        idComment:comment._id,
                                        user:comment.user
                                    })
                                    textInputRef.current?.blur(); 
                                    setTimeout(() => {
                                        textInputRef.current?.focus();
                                    }, 100); 
                                }}/>
                            </>:
                             <TextComponent text={'Đang đăng...'} color={'#727272'} />

                            }
                        </RowComponent>
                        {(comment.replyComment && comment.replyCommentCount) > 0 && <View style={{flex:1}}>
                            <SpaceComponent height={8} />
                           {
                            !isSeeMore ?  <TouchableOpacity onPress={()=>seeMoreComment()}>
                             <RowComponent>
                                 <RowComponent>
                                     <AvatarItem photoUrl={comment?.replyComment[0]?.user?.photoUrl} size={22} borderWidth={1} colorBorderWidth={colors.gray3} />
                                     <SpaceComponent width={4} />
                                     <TextComponent text={comment?.replyComment[0]?.user?.fullname ?? 'Người dùng'} size={14} font={fontFamilies.medium} />
                                 </RowComponent>
                                 <SpaceComponent width={4} />
                                 <TextComponent flex={1} text={comment?.replyComment[0]?.content ?? ''} size={13} numberOfLine={1} />
                             </RowComponent>
                            {(comment.replyComment && comment.replyCommentCount) > 1 &&  <>
                                 <SpaceComponent height={4} />
                                 <TextComponent flex={1} text={`Xem thêm ${comment.replyCommentCount - 1} phản hồi khác...`} size={13} font={fontFamilies.medium} numberOfLine={1} />
                             </>}
                         </TouchableOpacity>
                         : (
                            comment.replyComment.map((item)=>{
                                return renderCommentChild({comment:item})
                            })
                         )
                        
                           }
                            
                            
                        </View>}

                    </View>
                </RowComponent>
                <SpaceComponent height={10} />
            </>
        )
    },[comments,isShowing])
    const snapPoints = useMemo(() => ['80%'], []);
    const handleCallAPIComment = async ()=>{
        if(textComment){
            if(selectedCommentReply.idComment){
               
                const api = apis.comment.replyCommentEvent()
                try {
                    const res = await commentAPI.HandleComment(api,{idUserReply:auth.id,idEvent:idEvent,content:textComment,idComment:selectedCommentReply.idComment},'post')
                    if(res && res.data && res.status === 200){
                        const index = comments.findIndex((item) => item._id === selectedCommentReply.idComment);
                        if (index !== -1) {
                            comments[index].replyComment.unshift({
                                _id: '',
                                content: textComment,
                                createdAt: new Date(),
                                user: {
                                    _id:auth?.id,
                                    fullname:auth?.fullname,
                                    photoUrl:auth?.photoUrl
                                },
                                seeMore:true
                            });
                            comments[index].replyCommentCount +=1
                            setSelectedCommentReply({
                                idComment:'',
                                user:{
                                    _id:'',
                                    fullname:'',
                                    photoUrl:''
                                }
                            })
                        }
                    }
                } catch (error:any) {
                    const errorMessage = JSON.parse(error.message)
                    console.log('Lỗi rồi CommentComponent',errorMessage)
                }
               
            }else{
                comments.unshift({
                    _id:'',
                    content:textComment,
                    user:{
                        _id:auth.id,
                        fullname:auth.fullname,
                        photoUrl:auth.photoUrl
                    },
                    event:idEvent,
                    replyComment:[],
                    replyCommentCount:0,
                    createdAt:new Date(),
                    isLoading:true
    
                })
                flatListRef?.current?.scrollToOffset({ animated: true, offset: 0 });
                const api = apis.comment.commentEvent()
                try {
                    const res = await commentAPI.HandleComment(api,{idUser:auth.id,idEvent:idEvent,content:textComment},'post')
                    if(res && res.data && res.status === 200){
                        comments[0]._id = res.data._id
                        comments[0].isLoading = false
                    }
                } catch (error:any) {
                    const errorMessage = JSON.parse(error.message)
                    console.log('Lỗi rồi CommentComponent',errorMessage)
                }

            }
            setTextComment('')

        }
    }
    return (
        <BottomSheet
            onChange={handleSheetChanges}
            enablePanDownToClose={true}
            index={-1}
            snapPoints={snapPoints}
            ref={ref}
            containerStyle={{ zIndex: 100, marginTop: appInfo.sizes.HEIGHT * 0.3 }}

        >
            <BottomSheetView>
                <SectionComponent>
                    <RowComponent>
                        <TextComponent text={'Phù hợp nhất'} font={fontFamilies.medium} />
                        <SpaceComponent width={4} />
                        <FontAwesome name='chevron-down' size={12} color={colors.background} />
                    </RowComponent>
                </SectionComponent>

            </BottomSheetView>
           {comments && comments.length > 0 ? <BottomSheetFlatList
                ref={flatListRef}
                data={comments}
                renderItem={({item}) => {
                    return <RenderComment  comment={item}/>
                }}
                showsVerticalScrollIndicator={false}
                scrollEnabled
            /> : 
            <>
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <TextComponent text={'Chưa có bình luận nào'} size={16} font={fontFamilies.medium}/>
                <TextComponent text={'Hãy là người bình luận đầu tiên.'} size={13} />
            </View>
            </>}

            <View style={{ paddingHorizontal: 12, paddingVertical: 4, borderTopWidth: 1, borderTopColor: '#ececec' }}>
                {selectedCommentReply.idComment && <View style={{paddingLeft:12}}>
                    <RowComponent>
                        <TextComponent text={'Đang phản hồi'} size={14}/>
                        <TextComponent text={` ${selectedCommentReply.user.fullname}`} font={fontFamilies.medium} size={14}/>
                        <ButtonComponent text="- Hủy" textColor={colors.gray} onPress={()=>setSelectedCommentReply({
                            idComment:'',
                            user:{
                                _id:'',
                                fullname:'',
                                photoUrl:''
                            }
                        })}/>
                    </RowComponent>
                    <SpaceComponent height={4}/>
                </View>}
                <InputComponent
                    value={textComment}
                    onChange={(val) => setTextComment(val)}
                    styles={{ marginBottom: 0, minHeight: 40, borderRadius: 100 ,paddingRight:12,paddingLeft:0}}
                    bgColor="#f3f2f7"
                    placeholder="Bình luận gì đó..."
                    ref={textInputRef}
                    onEnd={()=>handleCallAPIComment()}
                    suffix={<FontAwesome onPress={()=>handleCallAPIComment()} name={textComment ? "send" : "send-o"} size={16} color={textComment ? colors.blue : colors.black}/>}
                />
            </View>
        </BottomSheet>
    )
})


export default CommentComponent