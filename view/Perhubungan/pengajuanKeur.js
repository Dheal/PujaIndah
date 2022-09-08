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
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useDispatch} from 'react-redux';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faArrowLeft,
  faFilePdf,
  faPaperclip,
  faCamera,
  faFolderOpen,
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
import DateTimePickerModal from 'react-native-modal-datetime-picker';

function PengajuanKeur({navigation}) {
  const [lokasiUji, setLokasiUji] = useState('');
  const [jenisKendaraan, setJenisKendaraan] = useState('');
  const [nomorKendaraan, setNomorKendaraan] = useState('');
  const [fungsiKendaraan, setFungsiKendaraan] = useState('');
  const [tahunPembuatan, setTahunPembuatan] = useState('');
  const [nomorChasis, setNomorChasis] = useState('');
  const [nomorMesin, setNomorMesin] = useState('');
  const [muatanSumbu, setMuatanSumbu] = useState('');
  const [jumlahBeban, setJumlahBeban] = useState('');
  const [jumlahBebanIzin, setJumlahBebanIzin] = useState('');
  const [profil, setProfil] = useState({});
  const [modalVisibleSukses, setModalVisibleSukses] = useState(false);
  const [statusData, setStatusData] = useState('');
  const modalizeRef = useRef(null);
  const modalizeRefKTP = useRef(null);
  const [modalHandleFoto, setModalHandleFoto] = useState(false);
  const [foto, setFoto] = useState(null);
  const [namaFoto, setNamaFoto] = useState('Unggah Foto');
  const [dataFotoKejadian, setDataFotoKejadian] = useState({});
  const [linkFotoKejadian, setLinkFotoKejadian] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [listLokasiUji, setListLokasiUji] = useState([]);
  const [listJenisKendaraan, setListJenisKendaraan] = useState([]);
  const [tanggal, setTanggal] = useState('');
  const [showTanggal, setShowTanggal] = useState(false);

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

  const getLokasiKeur = async () => {
    const idDaerah = await AsyncStorage.getItem('m_daerah_id');
    Axios({
      url: url + `/public/lokasi_keur?m_daerah_id=${idDaerah}&per_page=100`,
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + (await AsyncStorage.getItem('token')),
      },
    })
      .then(response => {
        setListLokasiUji(response.data.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getJenisKendaraan = async () => {
    const idDaerah = await AsyncStorage.getItem('m_daerah_id');
    Axios({
      url: url + `/public/jenis_kendaraan?m_daerah_id=${idDaerah}&per_page=100`,
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + (await AsyncStorage.getItem('token')),
      },
    })
      .then(response => {
        setListJenisKendaraan(response.data.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const pilihFoto = () => {
    modalizeRef.current?.open();
  };

  const ambilDariCamera = () => {
    modalizeRef.current?.close();
    ImagePicker.launchCamera(
      {
        mediaType: 'photo',
        includeBase64: false,
        //   maxHeight: 200,
        //   maxWidth: 200,
        quality: 0.3,
      },
      response => {
        if (!response.didCancel) {
          let formData = new FormData();
          setFoto(response.uri);
          // setDataFoto(response.data);
          setNamaFoto(response.fileName);
          formData.append('file', {
            uri: response.uri,
            name: response.fileName,
            type: response.type,
          });
          // setDataFotoKejadian(formData);
          kirimFotoKejadian(formData);
        }
      },
    );
  };

  const ambilDariGalery = () => {
    modalizeRef.current?.close();
    ImagePicker.launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
        //   maxHeight: 200,
        //   maxWidth: 200,
        quality: 0.3,
      },
      response => {
        if (!response.didCancel) {
          let formData = new FormData();
          setFoto(response.uri);
          // setDataFoto(response.data);
          setNamaFoto(response.fileName);
          formData.append('file', {
            uri: response.uri,
            name: response.fileName,
            type: response.type,
          });
          // setDataFotoKejadian(formData);
          kirimFotoKejadian(formData);
        }
      },
    );
  };

  const kirimFotoKejadian = async formData => {
    fetch(url + '/api/master/media/upload', {
      method: 'post',
      headers: {
        Authorization: 'Bearer ' + (await AsyncStorage.getItem('token')),
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      },
      body: formData,
    })
      .then(async res => {
        let data = await res.json();
        console.log(data);
        setLinkFotoKejadian(data.data.path);
      })
      .catch(err => {
        console.log('Gagal Kejadian');
      });
  };

  const handleSubmit = async () => {
    const idDaerah = await AsyncStorage.getItem('m_daerah_id');
    Axios({
      url: url + `/keur/pendaftaran?m_daerah_id=${idDaerah}&per_page=100`,
      method: 'post',
      headers: {
        Authorization: 'Bearer ' + (await AsyncStorage.getItem('token')),
      },
      data: {
        m_daerah_id: idDaerah,
        nama: profil.name,
        alamat: !profil.alamat ? '' : profil.alamat,
        no_hp: !profil.phone ? '' : profil.phone,
        no_kendaraan: nomorKendaraan,
        jenis_kendaraan: jenisKendaraan,
        tahun_pembuatan: tahunPembuatan,
        id_koperasi: 123121312,
        no_chasis: nomorChasis,
        no_mesin: nomorMesin,
        masa_berlaku_awal: tanggal,
        foto_stnk: !linkFotoKejadian ? '' : linkFotoKejadian,
        lokasi_uji: lokasiUji,
        fungsi: fungsiKendaraan,
      },
    })
      .then(response => {
        console.log(response);
        setModalVisibleSukses(true);
        setStatusData(200);
        setTimeout(() => {
          navigation.navigate('DashboardPerhubungan');
        }, 3000);
      })
      .catch(error => {
        console.log(error.response);
        if (statusData !== 200) {
          setStatusData(error.response.status);
          setModalVisibleSukses(true);
          setTimeout(() => {
            setModalVisibleSukses(false);
          }, 2000);
        }
      });
  };

  useEffect(() => {
    getProfil();
    getLokasiKeur();
    getJenisKendaraan();
  }, []);
  return (
    <>
      <Modalize
        ref={modalizeRef}
        // snapPoint={150}
        modalHeight={150}
        HeaderComponent={
          <View style={{alignItems: 'flex-start', margin: 10}}>
            <Text style={{fontSize: 14}}>Pilih File</Text>
          </View>
        }>
        <View
          style={{
            marginTop: 20,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              marginHorizontal: 30,
              width: 100,
            }}>
            <TouchableOpacity
              onPress={ambilDariCamera}
              style={{alignItems: 'center'}}>
              <View>
                <FontAwesomeIcon color="#274799" size={35} icon={faCamera} />
              </View>
              <View>
                <Text>Kamera</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View
            style={{
              width: 100,
              marginHorizontal: 30,
            }}>
            <TouchableOpacity
              onPress={ambilDariGalery}
              style={{alignItems: 'center'}}>
              <View>
                <FontAwesomeIcon
                  color="#274799"
                  size={35}
                  icon={faFolderOpen}
                />
              </View>
              <View>
                <Text>Files</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modalize>
      <Modal animationType="fade" transparent={true} visible={modalHandleFoto}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Image
              style={{width: 50, height: 50}}
              source={require('../../assets/image/warning.png')}
            />

            <View style={{alignItems: 'center'}}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 14,
                  marginTop: 20,
                  justifyContent: 'center',
                }}>
                Harap melengkapi dokumen foto
              </Text>
            </View>

            <Pressable
              onPress={() => {
                setModalHandleFoto(!modalHandleFoto);
              }}
              style={{
                backgroundColor: '#ff0000',
                marginTop: 20,
                borderRadius: 10,
                width: 100,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: '#ffffff',
                  fontSize: 14,
                  margin: 10,
                }}>
                Close
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <View
        style={{
          // margin: 20,
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
            marginBottom: hp('2%'),
          }}>
          <View style={styles.arrow}>
            <FontAwesomeIcon
              color="white"
              size={30}
              icon={faArrowLeft}
              onPress={() => {
                navigation.navigate('DashboardPerhubungan');
              }}
            />
          </View>
          <View style={styles.boxLogin}>
            <Text style={[styles.textLogin, {color: 'white'}]}>
              Pengajuan KEUR Baru
            </Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <View>
              <Text style={styles.text}>Lokasi Uji</Text>
            </View>
            <View style={[styles.drbDown, {justifyContent: 'center'}]}>
              <Picker
                mode="dropdown"
                selectedValue={lokasiUji}
                onValueChange={(itemValue, itemIndex) => {
                  setLokasiUji(itemValue);
                }}>
                <Picker.Item
                  label="Pilih Uji Keur"
                  value=""
                  style={{color: '#b0b0b0', fontSize: 14}}
                />
                {listLokasiUji.map((item, index) => {
                  return (
                    <Picker.Item
                      key={index}
                      label={item?.nama_tempat}
                      value={item?.id}
                      style={{fontSize: 14}}
                    />
                  );
                })}
              </Picker>
            </View>
            <View>
              <Text style={styles.text}>Jenis Kendaraan</Text>
            </View>
            <View style={[styles.drbDown, {justifyContent: 'center'}]}>
              <Picker
                mode="dropdown"
                selectedValue={jenisKendaraan}
                onValueChange={(itemValue, itemIndex) => {
                  setJenisKendaraan(itemValue);
                }}>
                <Picker.Item
                  label="Pilih Jenis Kendaraan"
                  value=""
                  style={{color: '#b0b0b0', fontSize: 14}}
                />
                {listJenisKendaraan.map((item, index) => {
                  return (
                    <Picker.Item
                      key={index}
                      label={item?.nama}
                      value={item?.id}
                      style={{fontSize: 14}}
                    />
                  );
                })}
              </Picker>
            </View>
            <View>
              <Text style={styles.text}>Nomor Kendaraan</Text>
            </View>
            <View style={styles.boxInput}>
              <TextInput
                style={styles.textInput}
                onChangeText={val => setNomorKendaraan(val)}
                placeholder="Nomor Kendaraan"
              />
            </View>
            <View>
              <Text style={styles.text}>Fungsi Kendaraan</Text>
            </View>
            <View style={styles.boxInput}>
              <TextInput
                style={styles.textInput}
                onChangeText={val => setFungsiKendaraan(val)}
                placeholder="Fungsi Kendaraan"
              />
            </View>
            <View>
              <Text style={styles.text}>Tahun Pembuatan</Text>
            </View>
            <View style={styles.boxInput}>
              <TextInput
                style={styles.textInput}
                onChangeText={val => setTahunPembuatan(val)}
                placeholder="Tahun Pembuatan"
              />
            </View>
            <View>
              <Text style={styles.text}>Nomor Chasis</Text>
            </View>
            <View style={styles.boxInput}>
              <TextInput
                style={styles.textInput}
                onChangeText={val => setNomorChasis(val)}
                placeholder="Nomor Chasis"
              />
            </View>
            <View>
              <Text style={styles.text}>Nomor Mesin</Text>
            </View>
            <View style={styles.boxInput}>
              <TextInput
                style={styles.textInput}
                onChangeText={val => setNomorMesin(val)}
                placeholder="Nomor Mesin"
              />
            </View>

            {/* <View>
              <Text style={styles.text}>Muatan Sumbu Terberat</Text>
            </View>
            <View style={styles.boxInput}>
              <TextInput
                style={styles.textInput}
                onChangeText={val => setMuatanSumbu(val)}
                placeholder="Muatan Sumbu Terberat"
              />
            </View>
            <View>
              <Text style={styles.text}>Jumlah beban yang diperbolehkan</Text>
            </View>
            <View style={styles.boxInput}>
              <TextInput
                style={styles.textInput}
                onChangeText={val => setJumlahBeban(val)}
                placeholder="Jumlah beban yang diperbolehkan"
              />
            </View>
            <View>
              <Text style={styles.text}>Jumlah beban yang di izinkan</Text>
            </View>
            <View style={styles.boxInput}>
              <TextInput
                style={styles.textInput}
                onChangeText={val => setJumlahBebanIzin(val)}
                placeholder="Jumlah beban yang di izinkan"
              />
            </View> */}
            <View>
              <Text style={styles.text}>Masa Berlaku Awal</Text>
            </View>
            <View style={styles.boxInputTanggal}>
              <TouchableOpacity
                onPress={() => setShowTanggal(true)}
                style={styles.tanggal}>
                <Text
                  style={{
                    color: !tanggal ? '#b0b0b0' : 'black',
                    fontSize: 18,
                    margin: 10,
                    marginTop: 15,
                  }}
                  onChangeText={text => setTanggal(text)}>
                  {!tanggal ? 'dd/mm/yyyy' : tanggal}
                </Text>
                <View>
                  <DateTimePickerModal
                    minimumDate={new Date()}
                    isVisible={showTanggal}
                    mode="date"
                    onConfirm={val => {
                      setTanggal(
                        `${val.getFullYear()}-${(
                          '0' +
                          (val.getMonth() + 1)
                        ).slice(-2)}-${('0' + val.getDate()).slice(-2)}`,
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
            <View>
              <Text style={styles.text}>Unggah Gambar/Foto STNK</Text>
            </View>
            <View style={[styles.boxInput, {flexDirection: 'row'}]}>
              <TextInput
                value={namaFoto}
                style={[styles.textInput, {flex: 5}]}
                // onChangeText={val => setJudulPengaduan(val)}
                // placeholder="Judul Pengaduan"
                editable={false}
              />
              <TouchableOpacity
                onPress={pilihFoto}
                style={{
                  flex: 1,
                  // borderWidth: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <FontAwesomeIcon color="grey" size={25} icon={faCamera} />
              </TouchableOpacity>
            </View>
            <View style={styles.boxButton}>
              <TouchableOpacity
                style={styles.buttonLogin}
                onPress={handleSubmit}>
                <Text style={styles.textButton}>Kirim</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisibleSukses}>
        <View style={styles.centeredViewModal}>
          <View style={styles.modalView}>
            <Image
              style={{width: 50, height: 50}}
              source={
                statusData == 200
                  ? require('../../assets/image/success.png')
                  : require('../../assets/image/warning.png')
              }
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
                  ? 'Pengajuan Keur Baru Berhasil'
                  : 'Mohon Maaf Pengajuan Keur Gagal'}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#C67FEF',
    height: '100%',
  },

  container: {
    marginTop: -15,
    paddingHorizontal: 15,
    borderRadius: 10,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  boxInput: {
    margin: 5,
    borderRadius: 10,
    width: '100%',
    backgroundColor: '#ffffff',
    borderWidth: 1,
  },
  boxInputPassword: {
    flexDirection: 'row',
    margin: 5,
    borderRadius: 10,
    width: '100%',
    backgroundColor: '#ffffff',
    borderWidth: 1,
  },
  buttonLogin: {
    borderRadius: 10,
    width: '100%',
    height: 55,
    backgroundColor: '#274799',
    marginTop: 20,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 18,
    margin: 5,
    marginTop: 15,
    color: 'black',
  },
  textInput: {
    marginLeft: 10,
    fontSize: 16,
    color: '#000000',
  },
  textButton: {
    textAlign: 'center',
    margin: 5,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#ffffff',
  },
  boxButton: {
    width: '100%',
    marginTop: 40,
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

  lupa: {
    marginTop: 10,
    // borderWidth: 1,
    // flex: 1,
    borderColor: 'grey',
    width: '100%',
    alignItems: 'flex-end',
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
  centeredViewModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#080a1a99',
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
    width: '80%',
  },
  boxInputTanggal: {
    margin: 5,
    borderRadius: 10,
    width: '100%',
    height: 50,

    backgroundColor: '#ffffff',
    borderWidth: 1,
  },
});
export default PengajuanKeur;
