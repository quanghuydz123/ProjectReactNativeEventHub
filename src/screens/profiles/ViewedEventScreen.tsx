import { useState } from "react";
import { ContainerComponent, DataLoaderComponent, SectionComponent, TextComponent } from "../../components";
import SearchComponent from "../../components/SearchComponent";
import { colors } from "../../constrants/color";
import { useSelector } from "react-redux";
import { authSelector, AuthState } from "../../reduxs/reducers/authReducers";
import { FlatList } from "react-native";
import EventItemHorizontal from "../../components/EventItemHorizontal";
import { EventModelNew } from "../../models/EventModelNew";

interface Props {}

// Hàm loại bỏ dấu tiếng Việt
const removeVietnameseTones = (str:string) => {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
};

const ViewedEventScreen = ({ navigation, route }: any) => {
    const { bgColor }: { bgColor?: string} = route.params

    const [searchKey, setSearchKey] = useState('');
    const auth: AuthState = useSelector(authSelector);

    // Lọc sự kiện dựa vào từ khóa tìm kiếm, không phân biệt hoa thường và dấu tiếng Việt
    const filteredEvents = auth.viewedEvents.filter(eventItem => {
        const normalizedSearchKey = removeVietnameseTones(searchKey).toLowerCase();
        const normalizedTitle = removeVietnameseTones(eventItem.event.title).toLowerCase();
        return normalizedTitle.includes(normalizedSearchKey);
    });

    return (
        <ContainerComponent title={'Sự kiện xem gần đây'} back bgColor={bgColor ?? colors.white}>
            <SectionComponent styles={{ paddingBottom: 8 }}>
                <SearchComponent 
                    isNotShowArrow 
                    onSearch={(val) => setSearchKey(val)} 
                    value={searchKey} 
                    onEnd={() => console.log('ok')} 
                    bgColor={bgColor ? colors.background : colors.gray8}
                    textColor={bgColor ? colors.white : colors.black}
                />
            </SectionComponent>
            <SectionComponent styles={{ flex: 1 }}>
                <DataLoaderComponent 
                    isFlex 
                    data={filteredEvents} 
                    isLoading={false}
                    messageEmpty="Không có sự kiện nào phù hợp"
                    messTextColor={bgColor ? colors.white : colors.black}
                    
                    children={
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={filteredEvents}
                            keyExtractor={(item) => item.event._id} // đảm bảo mỗi item có một key duy nhất
                            renderItem={({ item }) => (
                                <EventItemHorizontal item={item.event} bgColor={bgColor ?? colors.white} textCalendarColor={bgColor ? colors.white : colors.background} titleColor={bgColor ? colors.white : colors.black} />
                            )}
                        />
                    }
                />
            </SectionComponent>
        </ContainerComponent>
    );
};

export default ViewedEventScreen;
