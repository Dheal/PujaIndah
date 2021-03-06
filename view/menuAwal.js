import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
  ImageBackground,
} from 'react-native';
import {useDispatch} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

function menuAwal({navigation}) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  // const login = () => {
  //   console.log('login');
  // };

  // const daftar = () => {
  //   console.log('daftar');
  // };

  return (
    <>
      <View style={{flex: 1, backgroundColor: '#246EE9'}}>
        <LinearGradient
          colors={['#116FD5', '#2288E5', '#369FF4']}
          style={styles.lingkaran1}></LinearGradient>
        <LinearGradient
          colors={['#116FD5', '#2288E5', '#369FF4']}
          style={styles.lingkaran2}>
          <Image
            style={{width: hp('12%'), height: hp('15%')}}
            source={require('../assets/image/logoPuja.png')}></Image>
        </LinearGradient>
        <View style={styles.boxButtonLogin}>
          <TouchableOpacity
            style={styles.buttonLogin}
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.textButtonLogin}>Login</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.boxButtonDaftar}>
          <TouchableOpacity
            style={styles.buttonDaftar}
            onPress={() => navigation.navigate('DaftarAkun')}>
            <Text style={styles.textButtonDaftar}>Daftar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = {
  lingkaran1: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,
    elevation: 20,
    height: hp('50%'),
    width: hp('50%'),
    borderRadius: hp('50%') / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -hp('10%'),
    marginLeft: -hp('15%'),
  },
  lingkaran2: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,
    elevation: 20,
    height: hp('25%'),
    width: hp('25%'),
    borderRadius: hp('25%') / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -hp('35%'),
  },
  textButtonLogin: {
    textAlign: 'center',
    margin: 5,
    fontWeight: 'bold',
    fontSize: 16,
    color: 'black',
  },
  boxButtonLogin: {
    marginTop: hp('40%'),
    alignItems: 'center',
  },
  buttonLogin: {
    borderRadius: 10,
    width: wp('90%'),
    height: 50,
    backgroundColor: '#FFFFFF',
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
  boxButtonDaftar: {
    marginTop: hp('0.5%'),
    alignItems: 'center',
  },
  textButtonDaftar: {
    textAlign: 'center',
    margin: 5,
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
  },
  buttonDaftar: {
    borderRadius: 10,
    width: wp('90%'),
    height: 50,
    backgroundColor: '#369FF4',
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
};
export default menuAwal;
