import {View} from 'react-native';
import {EventModelNew} from '../models/EventModelNew';
import TextComponent from './TextComponent';
import {colors} from '../constrants/color';
import {fontFamilies} from '../constrants/fontFamilies';
import EventItem from './EventItem';
import SpaceComponent from './SpaceComponent';
import ButtonComponent from './ButtonComponent';
import {useNavigation} from '@react-navigation/native';

interface Props {
  relatedEvents: EventModelNew[];
}
const ListEventRelatedComponent = (props: Props) => {
  const {relatedEvents} = props;
  const navigation: any = useNavigation();
  return (
    <View style={{backgroundColor: colors.black, flex: 1, paddingBottom: 12}}>
      <TextComponent
        text={'Có thể bạn cũng quan tâm'}
        styles={{paddingVertical: 10}}
        color={colors.white}
        textAlign="center"
        font={fontFamilies.bold}
        size={17}
      />
      {relatedEvents && relatedEvents.length > 0 ? (
        relatedEvents
          .reduce((rows: any, event: EventModelNew, index) => {
            // Mỗi nhóm chứa 2 phần tử
            if (index % 2 === 0) {
              rows.push([event]);
            } else {
              rows[rows.length - 1].push(event);
            }
            return rows;
          }, [])
          .map((row: EventModelNew[], rowIndex: number) => (
            <View
              key={rowIndex}
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              {row.map(event => (
                <EventItem
                  bgColor={colors.black}
                  item={event}
                  key={event._id}
                  isShownVertical={true}
                />
              ))}
            </View>
          ))
      ) : (
        <View style={{paddingVertical: 50}}>
          <TextComponent
            text={'Không có sự kiện nào'}
            color={colors.white}
            textAlign="center"
          />
        </View>
      )}
      <SpaceComponent height={10} />
      <ButtonComponent
        type="primary"
        text="Xem thêm sự kiện"
        width={'auto'}
        styles={{borderRadius: 100, paddingVertical: 8}}
        textSize={13}
        mrBottom={0}
        onPress={() => navigation.push('SearchEventsScreen', {})}
      />
    </View>
  );
};

export default ListEventRelatedComponent;
