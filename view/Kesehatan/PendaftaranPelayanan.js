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
  faArrowLeft,
  faCalendarDays,
  faMapMarkerAlt,
  faPhoneAlt,
} from '@fortawesome/free-solid-svg-icons';
import {Modalize} from 'react-native-modalize';
import Axios from 'axios';
import url from '../../config';
import AsyncStorage from '@react-native-community/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {faClock} from '@fortawesome/free-regular-svg-icons';

function PendaftaranPelayananKesehatan({navigation, route}) {
  const {faskes, poli} = route.params;
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [nik, setNik] = useState('');
  const [idKelamin, setIdKelamin] = useState();
  const [profil, setProfil] = useState({});
  const [showTanggal, setShowTanggal] = useState(false);
  const [tanggal, setTanggal] = useState('');
  const [showTime, setShowTime] = useState(false);
  const [time, setTime] = useState('');

  const [kategoriPoli, setKategoriPoli] = useState('');
  const [dokterPoli, setDokterPoli] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [modalVisibleSukses, setModalVisibleSukses] = useState(false);
  const [statusData, setStatusData] = useState();
  const [tempatLahir, setTempatLahir] = useState('');
  const [tinggiBadan, setTinggiBadan] = useState('');
  const [beratBadan, setBeratBadan] = useState('');
  const [riwayatKesehatan, setRiwayatKesehatan] = useState('');
  const [alergiObat, setAlergiObat] = useState('');
  const [alerigiMakanan, setAlergiMakanan] = useState('');

  const getProfil = async () => {
    Axios({
      url: url + '/api/master/profile/user-detail',
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + (await AsyncStorage.getItem('token')),
      },
    })
      .then(response => {
        setProfil(response.data.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getDataPoli = async () => {
    Axios({
      url:
        url + `/public/pus_nakes?pus_poli_id=${faskes.id}&page=0&per_page=20`,
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + (await AsyncStorage.getItem('token')),
      },
    })
      .then(response => {
        // console.log('data poli', response.data.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getDataDokter = async value => {
    Axios({
      url:
        url + `/public/pus_nakes?pus_puskesmas_id=${value}&page=0&per_page=20`,
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + (await AsyncStorage.getItem('token')),
      },
    })
      .then(response => {
        console.log('ini', response.data.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    getDataPoli();
    getProfil();
  }, []);

  const handleDaftar = async () => {
    Axios({
      url: url + '/faskes/daftar/' + faskes.id,
      method: 'post',
      headers: {
        Authorization: 'Bearer ' + (await AsyncStorage.getItem('token')),
      },
      data: {
        nik: profil.nik,
        nama: profil.name,
        alamat: !profil.alamat ? '' : profil.alamat,
        kelamin: idKelamin,
        tempat_lahir: tempatLahir,
        tanggal_lahir: '',
        no_hp: '',
        riwayat_kesehatan: riwayatKesehatan,
        alergi_makanan: alerigiMakanan,
        alergi_obat: alergiObat,
        tinggi_badan: tinggiBadan,
        berat_badan: beratBadan,
      },
    })
      .then(response => {
        console.log(response);
        setModalVisibleSukses(true);
        setStatusData(200);
        setTimeout(() => {
          setModalVisibleSukses(false);
          navigation.navigate('BerhasilDaftarLayanan', {
            faskes: faskes,
          });
        }, 3000);
      })
      .catch(error => {
        if (statusData !== 200) {
          setStatusData(500);
          setModalVisibleSukses(true);
          setTimeout(() => {
            setModalVisibleSukses(false);
          }, 2000);
        }
      });
  };
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
          }}>
          <View style={styles.arrow}>
            <FontAwesomeIcon
              color="white"
              size={30}
              icon={faArrowLeft}
              onPress={() => {
                navigation.navigate('DetailFasilitasKesehatan');
              }}
            />
          </View>
          <View style={styles.boxJudul}>
            <Text style={[styles.textJudul, {color: 'white'}]}>
              Pendaftaran Pelayanan
            </Text>
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <View>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: 'black',
                  fontSize: 14,
                  marginTop: hp('2%'),
                }}>
                {faskes?.nama}
              </Text>
            </View>
            <View style={{flexDirection: 'row', marginTop: hp('2%')}}>
              <View>
                <FontAwesomeIcon size={20} icon={faMapMarkerAlt} />
              </View>
              <View style={{marginLeft: 5}}>
                <Text>{faskes.alamat}</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', marginTop: hp('1%')}}>
              <View style={{rotation: 90}}>
                <FontAwesomeIcon size={20} icon={faPhoneAlt} />
              </View>
              <View style={{marginLeft: 5}}>
                <Text>{faskes.no_telp}</Text>
              </View>
            </View>
            <View
              style={{
                borderTopWidth: 2,
                marginTop: hp('3%'),
                borderColor: '#758097',
                opacity: 0.5,
              }}
            />
            <View style={{marginTop: hp('3%')}}>
              <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                Form Pendaftaran Layanan
              </Text>
            </View>
            <View>
              <Text style={styles.text}>Nama</Text>
            </View>
            <View style={styles.boxInput}>
              <TextInput
                editable={false}
                value={profil.name}
                style={styles.textInput}
                onChangeText={val => setNama(val)}
                placeholder="Nama"
              />
            </View>

            <View>
              <Text style={styles.text}>NIK</Text>
            </View>
            <View style={styles.boxInput}>
              <TextInput
                editable={false}
                value={profil.nik}
                style={styles.textInput}
                onChangeText={val => setNik(val)}
                placeholder="NIK"
              />
            </View>
            <View>
              <Text style={styles.text}>Alamat</Text>
            </View>
            <View style={styles.boxInput}>
              <TextInput
                editable={false}
                value={profil.alamat}
                style={styles.textInput}
                onChangeText={val => setEmail(val)}
                placeholder="Alamat"
              />
            </View>
            <View>
              <Text style={styles.text}>Tanggal Lahir</Text>
            </View>

            <View style={[styles.tanggal, {flexDirection: 'row'}]}>
              <View style={{flex: 1, justifyContent: 'center'}}>
                <TouchableOpacity onPress={() => setShowTanggal(true)}>
                  <Text
                    style={[
                      styles.textCalendar,
                      {color: !tanggal ? '#b0b0b0' : 'black', borderWidth: 0},
                    ]}>
                    {!tanggal ? 'Tanggal Lahir' : tanggal}
                  </Text>
                  <View>
                    <DateTimePickerModal
                      minimumDate={new Date()}
                      isVisible={showTanggal}
                      mode="date"
                      onConfirm={val => {
                        setTanggal(
                          `${('0' + val.getDate()).slice(-2)}-${(
                            '0' +
                            (val.getMonth() + 1)
                          ).slice(-2)}-${val.getFullYear()}`,
                        );
                        setShowTanggal(false);
                      }}
                      onCancel={() => {
                        setShowTanggal(false);
                      }}
                    />
                  </View>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  padding: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <FontAwesomeIcon
                  color="#A19C9C"
                  size={25}
                  icon={faCalendarDays}
                />
              </View>
            </View>

            <View>
              <Text style={styles.text}>Tempat Lahir</Text>
            </View>
            <View style={styles.boxInput}>
              <TextInput
                style={styles.textInput}
                onChangeText={val => setTempatLahir(val)}
                placeholder="Tempat Lahir"
              />
            </View>
            <View style={{marginTop: 5}}>
              <Text style={styles.text}>Jenis Kelamin</Text>
            </View>
            <View style={[styles.drbDown, {justifyContent: 'center'}]}>
              <Picker
                mode="dropdown"
                selectedValue={idKelamin}
                onValueChange={(itemValue, itemIndex) => {
                  setIdKelamin(itemValue);
                }}>
                <Picker.Item
                  label="Pilih Kategori"
                  value=""
                  style={{color: '#b0b0b0', fontSize: 14}}
                />
                <Picker.Item
                  label="Laki-Laki"
                  value="L"
                  style={{fontSize: 14}}
                />
                <Picker.Item
                  label="Perempuan"
                  value="P"
                  style={{fontSize: 14}}
                />
              </Picker>
            </View>
            <View style={{marginTop: 5}}>
              <Text style={styles.text}>Tinggi Badan</Text>
            </View>
            <View style={[styles.boxInput, {flexDirection: 'row'}]}>
              <TextInput
                keyboardType="numeric"
                style={[styles.textInput, {flex: 5}]}
                onChangeText={val => setTinggiBadan(val)}
                placeholder="Tinggi Badan"
              />
              <View
                style={{
                  flex: 1,
                  // borderWidth: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{color: '#A19C9C'}}>cm</Text>
                {/* <FontAwesomeIcon color="grey" size={25} icon={fa} /> */}
              </View>
            </View>
            <View style={{marginTop: 5}}>
              <Text style={styles.text}>Berat Badan</Text>
            </View>
            <View style={[styles.boxInput, {flexDirection: 'row'}]}>
              <TextInput
                keyboardType="numeric"
                style={[styles.textInput, {flex: 5}]}
                onChangeText={val => setBeratBadan(val)}
                placeholder="Berat Badan"
              />
              <View
                style={{
                  flex: 1,
                  // borderWidth: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{color: '#A19C9C'}}>Kg</Text>
                {/* <FontAwesomeIcon color="grey" size={25} icon={fa} /> */}
              </View>
            </View>
            <View>
              <Text style={styles.text}>Riwayat Kesehatan</Text>
            </View>
            <View style={styles.boxInput}>
              <TextInput
                style={styles.textInput}
                onChangeText={val => setRiwayatKesehatan(val)}
                placeholder="Riwayat Kesehatan"
              />
            </View>
            <View>
              <Text style={styles.text}>Alergi Obat</Text>
            </View>
            <View style={styles.boxInput}>
              <TextInput
                style={styles.textInput}
                onChangeText={val => setAlergiObat(val)}
                placeholder="Alergi Obat"
              />
            </View>
            <View>
              <Text style={styles.text}>Alergi Makanan</Text>
            </View>
            <View style={styles.boxInput}>
              <TextInput
                style={styles.textInput}
                onChangeText={val => setAlergiMakanan(val)}
                placeholder="Alergi Makanan"
              />
            </View>
            <View style={{marginTop: 5}}>
              <Text style={styles.text}>Pilih Poli</Text>
            </View>
            <View style={[styles.drbDown, {justifyContent: 'center'}]}>
              <Picker
                mode="dropdown"
                selectedValue={kategoriPoli}
                onValueChange={(itemValue, itemIndex) => {
                  setKategoriPoli(itemValue);
                  getDataDokter(itemValue);
                }}>
                <Picker.Item
                  label="Pilih Poli"
                  value=""
                  style={{color: '#b0b0b0'}}
                />
                {poli.map((item, index) => {
                  return (
                    <Picker.Item
                      key={index}
                      label={item?.poli}
                      value={item?.id}
                    />
                  );
                })}
              </Picker>
            </View>

            {/* <View style={{marginTop: 5}}>
              <Text style={styles.text}>Pilih Dokter</Text>
            </View>
            <View style={[styles.drbDown, {justifyContent: 'center'}]}>
              <Picker
                mode="dropdown"
                selectedValue={dokterPoli}
                onValueChange={(itemValue, itemIndex) => {
                  setDokterPoli(itemValue);
                }}>
                <Picker.Item
                  label="Pilih Dokter"
                  value=""
                  style={{color: '#b0b0b0'}}
                />
                <Picker.Item label="Poli Gigi" value="java" />
              </Picker>
            </View> */}
            <View>
              <Text style={styles.text}>Pilih Tanggal Daftar</Text>
            </View>

            <View style={[styles.tanggal, {flexDirection: 'row'}]}>
              <View style={{flex: 1, justifyContent: 'center'}}>
                <TouchableOpacity onPress={() => setShowTanggal(true)}>
                  <Text
                    style={[
                      styles.textCalendar,
                      {color: !tanggal ? '#b0b0b0' : 'black', borderWidth: 0},
                    ]}>
                    {!tanggal ? 'Tanggal Daftar' : tanggal}
                  </Text>
                  <View>
                    <DateTimePickerModal
                      minimumDate={new Date()}
                      isVisible={showTanggal}
                      mode="date"
                      onConfirm={val => {
                        setTanggal(
                          `${('0' + val.getDate()).slice(-2)}-${(
                            '0' +
                            (val.getMonth() + 1)
                          ).slice(-2)}-${val.getFullYear()}`,
                        );
                        setShowTanggal(false);
                      }}
                      onCancel={() => {
                        setShowTanggal(false);
                      }}
                    />
                  </View>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  padding: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <FontAwesomeIcon
                  color="#A19C9C"
                  size={25}
                  icon={faCalendarDays}
                />
              </View>
            </View>
            <View>
              <Text style={styles.text}>Pilih Jadwal</Text>
            </View>

            <View style={[styles.tanggal, {flexDirection: 'row'}]}>
              <View style={{flex: 1, justifyContent: 'center'}}>
                <TouchableOpacity onPress={() => setShowTime(true)}>
                  <Text
                    style={[
                      styles.textCalendar,
                      {color: !time ? '#b0b0b0' : 'black', borderWidth: 0},
                    ]}>
                    {!time ? 'Pilih Jadwal' : time}
                  </Text>
                  <View>
                    <DateTimePickerModal
                      isVisible={showTime}
                      mode="time"
                      onConfirm={val => {
                        setTime(
                          `${('0' + val.getHours()).slice(-2)}:${(
                            '0' + val.getMinutes()
                          ).slice(-2)}`,
                        );
                        setShowTime(false);
                      }}
                      onCancel={() => {
                        setShowTime(false);
                      }}
                    />
                  </View>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  padding: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <FontAwesomeIcon color="#A19C9C" size={25} icon={faClock} />
              </View>
            </View>
            <View>
              <Text style={styles.text}>Keluhan</Text>
            </View>
            <View style={styles.boxInput}>
              <TextInput
                multiline={true}
                numberOfLines={4}
                style={[styles.textInput, {textAlignVertical: 'top'}]}
                onChangeText={val => setNik(val)}
                placeholder="Keluhan"
              />
            </View>
            <View
              style={{
                marginTop: hp('3%'),
                marginBottom: hp('5%'),
              }}>
              <View>
                <TouchableOpacity
                  style={styles.buttonLogin}
                  onPress={handleDaftar}>
                  <Text style={styles.textButton}>Daftar Layanan</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
      <>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisibleSukses}>
          <View style={styles.centeredViewModal}>
            <View style={styles.modalView}>
              <Image
                style={{width: 50, height: 50}}
                source={require('../../assets/image/success.png')}
              />
              <View style={{alignItems: 'center'}}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 14,
                    marginTop: 20,
                    justifyContent: 'center',
                  }}>
                  {statusData === 200
                    ? 'Berhasil Daftar'
                    : 'Mohon Maaf Pendaftaran Gagal'}
                </Text>
              </View>
            </View>
          </View>
        </Modal>
      </>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 10,
    width: wp('95%'),
    paddingHorizontal: 15,
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
    borderRadius: 10,
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
  tanggal: {
    borderWidth: 1,
    borderRadius: 10,
    height: 50,
    borderColor: '#A19C9C',
    width: '100%',
    marginLeft: 5,
    marginBottom: 0,
    paddingLeft: 10,
    color: '#000000',
    justifyContent: 'center',
  },
  textCalendar: {
    fontSize: 14,
  },
  picker: {
    marginVertical: 30,
    width: 300,
    padding: 10,
    borderWidth: 1,
    borderColor: '#666',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
export default PendaftaranPelayananKesehatan;
