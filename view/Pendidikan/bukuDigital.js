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
  Linking,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {Modalize} from 'react-native-modalize';
import Axios from 'axios';
import url from '../../config';
import AsyncStorage from '@react-native-community/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MapView, {Marker} from 'react-native-maps';
import {Picker} from '@react-native-picker/picker';
import getDataJson from '../../locales/m_daerah.json';
import SearchableDropdown from 'react-native-searchable-dropdown';

function BukuDigital({navigation}) {
  const [nama, setNama] = useState('');
  const [idKategoriAduan, setIdKategoriAduan] = useState();
  const [showTanggal, setShowTanggal] = useState(false);
  const [tanggal, setTanggal] = useState('');
  const [cari, setCari] = useState(false);
  const [idDaerah, setIdDaerah] = useState('');
  const [dataBuku, setDataBuku] = useState([]);

  const items = getDataJson.map(item => {
    const data = {};
    data.id = item.id;
    data.name = item.nama;
    return data;
  });

  const getData = async value => {
    Axios({
      url:
        url +
        `/public/pend_ebook?m_daerah_id=${
          !value ? idDaerah : value
        }&page=0&per_page=20`,
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + (await AsyncStorage.getItem('token')),
      },
    })
      .then(response => {
        setDataBuku(response.data.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const renderItem = ({item}) => {
    return (
      <>
        <View style={styles.containerList}>
          <View style={styles.content}>
            <View>
              <Image
                resizeMode="stretch"
                style={{width: 150, height: '90%', margin: 10}}
                source={{
                  uri: !item?.cover
                    ? 'https://indonesia.go.id/assets/upload/headline/1570616120_Puja_Indah_thumb.jpg'
                    : item?.cover,
                }}
              />
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                // alignItems: 'center',
              }}>
              <View style={{alignItems: 'center'}}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: 'black',
                    fontSize: 16,
                    marginTop: 10,
                    textAlign: 'center',
                  }}>
                  {item?.judul}
                </Text>
              </View>
              <View style={{alignItems: 'center'}}>
                <Text
                  style={{
                    color: '#817272',
                    fontSize: 12,
                    marginTop: 10,
                    textAlign: 'center',
                  }}>
                  Pengarang : {item?.pengarang}
                </Text>
              </View>

              <View style={{marginTop: hp('5%'), marginBottom: 10}}>
                <TouchableOpacity
                  style={styles.buttonBooking}
                  onPress={() => Linking.openURL(item?.file_ebook)}>
                  <Text style={{color: 'white'}}>Unduh</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </>
    );
  };
  return (
    <>
      <View
        style={{
          flex: 1,
          resizeMode: 'cover',
          // justifyContent: 'center',
          backgroundColor: 'white',
        }}>
        <View
          style={{
            flexDirection: 'row',
            // marginTop: hp('5%'),
            height: hp('10%'),
            backgroundColor: '#274799',
            alignItems: 'center',
          }}>
          <View style={styles.arrow}>
            <FontAwesomeIcon
              color="white"
              size={30}
              icon={faArrowLeft}
              onPress={() => {
                navigation.navigate('DashboardPendidikan');
              }}
            />
          </View>
          <View style={styles.boxJudul}>
            <Text style={[styles.textJudul, {color: 'white'}]}>
              Buku Digital
            </Text>
          </View>
        </View>
        <View style={styles.container}>
          <View style={{marginTop: 5}}>
            <Text style={styles.text}>Nama Daerah</Text>
          </View>
          <SearchableDropdown
            onItemSelect={item => {
              getData(item.id);
            }}
            containerStyle={{padding: 5}}
            onRemoveItem={(item, index) => {
              setIdDaerah(item);
            }}
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
        <View style={[styles.container, {flex: 1}]}>
          <View style={{marginTop: 20}}>
            <FlatList
              data={dataBuku}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 10,
    width: wp('95%'),
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  arrow: {
    marginLeft: 30,
  },
  boxJudul: {
    marginLeft: 30,
  },
  textJudul: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  buttonLogin: {
    borderRadius: 5,
    width: '100%',
    height: 55,
    backgroundColor: '#274799',
    marginTop: hp('3%'),
    justifyContent: 'center',
  },
  textButton: {
    textAlign: 'center',
    margin: 5,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#ffffff',
  },
  text: {
    fontSize: 14,
    margin: 5,
    marginTop: 15,
    color: 'black',
  },
  textInput: {
    marginLeft: 10,
    fontSize: 14,
    color: '#000000',
  },
  boxInput: {
    margin: 5,
    borderRadius: 10,
    width: '100%',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#A19C9C',
  },
  containerList: {
    // marginTop: 5,
    marginBottom: hp('3%'),
    marginLeft: 10,
    width: wp('85%'),
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 5,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  buttonBooking: {
    backgroundColor: '#274799',
    borderRadius: 5,

    height: hp('5%'),
    width: wp('40%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  drbDown: {
    borderWidth: 1,
    borderRadius: 10,
    height: 50,
    borderColor: '#A19C9C',
    width: '100%',
    marginLeft: 5,
    marginBottom: 0,
    padding: 10,
    color: '#000000',
  },
});
export default BukuDigital;
