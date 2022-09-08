import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  FlatList,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useDispatch} from 'react-redux';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faSearch,
  faArrowLeft,
  faMapMarkerAlt,
  faBriefcase,
  faPhoneAlt,
} from '@fortawesome/free-solid-svg-icons';
import {Modalize} from 'react-native-modalize';
import ImagePicker from 'react-native-image-picker';
import Axios from 'axios';
import url from '../../config';
import {ActivityIndicator} from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import {BallIndicator} from 'react-native-indicators';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MapView, {Marker} from 'react-native-maps';
import GetLocation from 'react-native-get-location';
import SearchableDropdown from 'react-native-searchable-dropdown';
import getDataJson from '../../locales/m_daerah.json';

function GawatDarurat({navigation}) {
  const [dataGawatDarurat, setDataGawatDarurat] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getData = async value => {
    const idDaerah = await AsyncStorage.getItem('m_daerah_id');
    setIsLoading(true);
    Axios({
      url:
        url +
        `/public/pus_puskesmas?m_daerah_id=${
          !value ? idDaerah : value
        }&igd=1&page=0&per_page=20`,
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + (await AsyncStorage.getItem('token')),
      },
    })
      .then(response => {
        setDataGawatDarurat(response?.data?.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.log(error);
      });
  };
  const items = getDataJson.map(item => {
    const data = {};
    data.id = item.id;
    data.name = item.nama;
    return data;
  });

  const renderItem = ({item}) => {
    return (
      <View style={styles.container}>
        <View style={styles.boxCard}>
          <View>
            <Text style={{fontSize: 14, fontWeight: 'bold'}}>{item?.nama}</Text>
          </View>
          <View style={{marginTop: hp('1%')}}>
            <Text style={{color: '#827474', fontSize: 12}}>{item.alamat}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: hp('3%'),
            }}>
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
              }}>
              <View>
                <FontAwesomeIcon
                  size={20}
                  icon={faMapMarkerAlt}
                  color="#274799"
                />
              </View>
              <View style={{marginLeft: 10}}>
                <Text style={{fontSize: 12, color: '#274799'}}>
                  Petunjuk arah
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
              }}>
              <View style={{rotation: 90}}>
                <FontAwesomeIcon size={20} icon={faPhoneAlt} color="#274799" />
              </View>
              <View style={{marginLeft: 10}}>
                <Text style={{fontSize: 12, color: '#274799'}}>
                  {item?.no_telp}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <View
        style={{
          flex: 1,
          resizeMode: 'cover',
          backgroundColor: 'white',
        }}>
        <View
          style={{
            flexDirection: 'row',
            height: hp('10%'),
            backgroundColor: '#274799',
            alignItems: 'center',
            marginBottom: hp('2%'),
          }}>
          <View style={styles.arrow}>
            <FontAwesomeIcon
              color="white"
              size={30}
              icon={faArrowLeft}
              onPress={() => {
                navigation.navigate('DashboardKesehatan');
              }}
            />
          </View>
          <View style={styles.boxLogin}>
            <Text style={[styles.textLogin, {color: 'white'}]}>
              Gawat Darurat
            </Text>
          </View>
        </View>
        <View style={{paddingHorizontal: 10}}>
          <SearchableDropdown
            onItemSelect={item => {
              getData(item.id);
            }}
            containerStyle={{padding: 5}}
            itemStyle={{
              padding: 10,
              marginTop: 2,
              backgroundColor: '#ddd',
              borderColor: '#bbb',
              borderWidth: 1,
              borderRadius: 5,
            }}
            itemTextStyle={{color: '#222'}}
            itemsContainerStyle={{height: '100%'}}
            items={items}
            resetValue={false}
            textInputProps={{
              placeholder: 'Cari Nama Daerah',
              underlineColorAndroid: 'transparent',
              style: {
                padding: 12,
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 5,
              },
            }}
            listProps={{
              nestedScrollEnabled: true,
            }}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: 10,
          }}>
          {/* <View style={[styles.boxInput, {flexDirection: 'row', flex: 4}]}>
            <TextInput
              style={[styles.textInput, {flex: 5, fontSize: 12, height: 40}]}
              // onChangeText={val => setFilter(val)}
              placeholder="Ketik Rumah Sakit atau Puskesmas"
            />
            <TouchableOpacity
              onPress={() => {}}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <FontAwesomeIcon color="grey" size={20} icon={faSearch} />
            </TouchableOpacity>
          </View> */}
        </View>
        {isLoading ? (
          <View
            style={{
              marginTop: 10,
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
            }}>
            <ActivityIndicator size={30} />
          </View>
        ) : dataGawatDarurat.length !== 0 ? (
          <View style={{flex: 1}}>
            <FlatList
              data={dataGawatDarurat}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
            />
          </View>
        ) : (
          <>
            <View style={{alignItems: 'center', marginTop: 30}}>
              <Text>Data tidak ditemukan</Text>
            </View>
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  textInput: {
    marginLeft: 10,
    fontSize: 16,
    color: '#000000',
  },
  boxInput: {
    margin: 5,
    borderRadius: 10,
    width: '100%',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'grey',
  },
  background: {
    backgroundColor: '#C67FEF',
    height: '100%',
  },

  container: {
    // marginTop: hp('2%'),
    margin: 15,
    borderRadius: 10,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: wp('100%'),
  },
  boxCard: {
    width: wp('90%'),
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#EFEFEF',
    marginTop: hp('2%'),
    paddingVertical: hp('3%'),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 5,
    backgroundColor: '#fff',
    marginTop: 20,
  },
  arrow: {
    // borderWidth: 1,
    // marginTop: 30,
    marginLeft: 30,
  },
  boxLogin: {
    // borderWidth: 1,
    marginLeft: 30,
    // marginTop: 30,
  },
  textLogin: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
export default GawatDarurat;
