import {FlatList, ScrollView, View} from 'react-native';
import {
  ButtonComponent,
  DataLoaderComponent,
  ListEventRelatedComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
  TicketComponent,
} from '../../../components';
import {colors} from '../../../constrants/color';
import SearchComponent from '../../../components/SearchComponent';
import {useEffect, useState} from 'react';
import {EventModelNew} from '../../../models/EventModelNew';
import CardComponent from '../../../components/CardComponent';
import {appInfo} from '../../../constrants/appInfo';
import {InvoiceDetailsModel} from '../../../models/InvoiceDetailsModel';
import {useSelector} from 'react-redux';
import {authSelector} from '../../../reduxs/reducers/authReducers';
import {apis} from '../../../constrants/apis';
import ticketAPI from '../../../apis/ticketAPI';

const PurchasedTicketsCanceledScreen = ({navigation, route}: any) => {
  const [searchKey, setSearchKey] = useState('');
  const {relatedEvents}: {relatedEvents: EventModelNew[]} = route.params;
  const [invoicePaid, setinvoicePaid] = useState<InvoiceDetailsModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const auth = useSelector(authSelector);
  useEffect(() => {
    handleCallAPIGetTicketsByIdUser();
  }, [auth]);
  const handleCallAPIGetTicketsByIdUser = async () => {
    const api = apis.ticket.getByIdUser({uid: auth.id, typeFilter: 'Canceled'});
    setIsLoading(true);
    try {
      const res = await ticketAPI.HandleTicket(api);
      if (res && res.status === 200 && res.data) {
        setinvoicePaid(res.data);
      }
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      const errorMessage = JSON.parse(error.message);
      console.log('Profile', errorMessage.message);
    }
  };
  return (
    <View style={{backgroundColor: colors.black, flex: 1, paddingTop: 12}}>
      <ScrollView style={{flex: 1}}>
        {
          <DataLoaderComponent
            data={invoicePaid}
            height={appInfo.sizes.HEIGHT * 0.6}
            isLoading={isLoading}
            children={invoicePaid.slice(0, 3).map(invoice => {
              return (
                <TicketComponent
                  invoice={invoice}
                  key={invoice.invoiceDetails._id}
                />
              );
            })}
          />
        }
        {invoicePaid && invoicePaid.length > 3 && (
          <View>
            <ButtonComponent
              onPress={() =>
                navigation.navigate('SearchAndListViewScreen', {
                  items: invoicePaid,
                  type: 'ticketPurchased',
                  title: 'Danh sách vé đã bị hủy',
                  bgColor: colors.black,
                  pdH: 1,
                  titleChild: `Tổng cộng: ${invoicePaid.length}`,
                })
              }
              text="Xem tất cả"
              type="primary"
              mrBottom={0}
              color={colors.primary}
              width={appInfo.sizes.WIDTH * 0.5}
              textSize={13}
              styles={{borderRadius: 100, paddingVertical: 8}}
              textColor={colors.white}
            />
          </View>
        )}
        <SpaceComponent height={10} />
        <SpaceComponent
          height={1}
          color={colors.gray}
          width={appInfo.sizes.WIDTH}
          styles={{}}
        />

        <ListEventRelatedComponent relatedEvents={relatedEvents} />
        <SpaceComponent height={20} />
      </ScrollView>
    </View>
  );
};

export default PurchasedTicketsCanceledScreen;
