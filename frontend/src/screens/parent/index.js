import React, { Component } from 'react';
import { Alert, View, Text, StyleSheet, Image, Dimensions,TextInput ,TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import Animated, { Easing } from 'react-native-reanimated';
import { TapGestureHandler, State } from 'react-native-gesture-handler';
import RestartAndroid from 'react-native-restart-android'
const { width, height } = Dimensions.get('window');
// for the animations Setting 
const {Value,event,block,cond,eq,set,Clock,startClock,stopClock,debug,timing,clockRunning,interpolate,concat,Extrapolate} = Animated;

function runTiming(clock, value, dest) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0)
  
  };

  const config = {
    duration: 1000,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease)
  };

  return block([
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, value),
      set(state.frameTime, 0),
      set(config.toValue, dest),
      startClock(clock)
    ]),
    timing(clock, state, config),
    cond(state.finished, debug('stop clock', stopClock(clock))),
    state.position
  ]);
}
//return + render 
class MusicApp extends Component {
  constructor(props) {
    super(props)
    this.state ={
      username: '',
      password:'',
      flag:0  
    }
    // functions to controll motion + styling 
    this.buttonOpacity = new Value(1);
    //control the white box when it is open 
    this.onStateChange = event([
      {
        nativeEvent: ({ state }) =>
          block([
            cond(
              eq(state, State.END),
              set(this.buttonOpacity, runTiming(new Clock(), 1, 0))
            )
          ])
      }
    ]);
    // control closing action when press on X
    this.onCloseState = event([
        {
          nativeEvent: ({ state }) =>
            block([
              cond(
                eq(state, State.END),
                set(this.buttonOpacity, runTiming(new Clock(), 0, 1))
              )
            ])
        }
      ]);


    this.buttonY = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [100, 0],
      extrapolate: Extrapolate.CLAMP
    });

    this.bgY = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [-height / 3, 0],
      extrapolate: Extrapolate.CLAMP
    });

    this.textInputZindex = interpolate(this.buttonOpacity, {
        inputRange: [0, 1],
        outputRange: [1,-1],
        extrapolate: Extrapolate.CLAMP
      });

    this.textInputY = interpolate(this.buttonOpacity, {
        inputRange: [0, 1],
        outputRange: [0,100],
        extrapolate: Extrapolate.CLAMP
      });

    this.textInputOpacity = interpolate(this.buttonOpacity, {
        inputRange: [0, 1],
        outputRange: [1,0],
        extrapolate: Extrapolate.CLAMP
      });

      this.rotateCross = interpolate(this.buttonOpacity, {
        inputRange: [0, 1],
        outputRange: [180,360],
        extrapolate: Extrapolate.CLAMP
      });
  }
  onchange = (name, value)=>{
    this.setState({
      [name]: value
    })
  }
  handleSubmit = () => {
    // console.log('---------handle submit---------this: ',this)
    // console.log('****************************')
    // console.log(this.state.username + "   " + this.state.password)

    var raw = JSON.stringify({"username":this.state.username,"password":this.state.password});
    var requestOptions = {
    method: 'POST',
    body: raw ,
    headers: {
    "Content-Type": "application/json",
    "Authorization": "Basic eG9ybzoxMjM="
    },
    redirect: 'follow'
    };
    //fetch("http://localhost:8000/auth/login/", requestOptions)
    fetch("https://blackpearl2.ew.r.appspot.com/jwt/", requestOptions)
    .then(response => response.json())
    .then( (result) => {
      
    if(result.token !== undefined){
      // console.log(result.token)
      AsyncStorage.setItem('@token', result.token)
      AsyncStorage.setItem('@user', this.state.username)
      this.props.props.navigation.navigate('parentProfile')
   
      } 
      else{
        Alert.alert(
          "User Sign-in",
          "signed in failed" + '\n' + 'username or password : incorrect',
          [
            { text: "Cancel", onPress: () =>{ console.log("Cancel Pressed") 
            this.props.props.navigation.navigate('Home')
           
          }},
          { text: "Try again", onPress: () =>{ console.log("try again") 
        }}
          ],
          { cancelable: true}
        );
      }
        
    }  
    )
.catch(error => console.log('error', error));
    
     //setUsername('')
    // setPassword('')
}
  //main return + render 
  render() {
    return (
      // const { navigation } = this.props;
      <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'flex-end'}}>
        {/* Background Picture */}
        <Animated.View style={{...StyleSheet.absoluteFill, transform: [{ translateY: this.bgY }]}}>
          <Image source={require('./PG.png')} style={{ flex: 1, height: null, width: null }}/>
        </Animated.View>
        {/* Landpage Content */}
        <View style={{ height: height / 3, justifyContent: 'center' }}>
          {/* Sign in button 1 control the main animation*/}
          <TapGestureHandler onHandlerStateChange={this.onStateChange}>
            <Animated.View style={{...styles.button,opacity: this.buttonOpacity,transform: [{ translateY: this.buttonY }]}}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>SIGN IN</Text>
            </Animated.View>
          </TapGestureHandler>
           {/* Sign up button */}
           


           <TouchableOpacity onPress={() => {this.props.props.navigation.navigate('SignUp')}}>
          <Animated.View style={{...styles.button,backgroundColor: '#dc962e',opacity: this.buttonOpacity,transform: [{ translateY: this.buttonY }]}}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>SIGN UP</Text>
          </Animated.View>
          </TouchableOpacity>
          {/* White Box Settings + Styleing */}
          <Animated.View style={{zIndex:this.textInputZindex,opacity:this.textInputOpacity,transform:[{translateY:this.textInputY}],height:height/3,...StyleSheet.absoluteFill,top:null,justifyContent:'center',}}>
              {/* Closeing Setting */}
           <TapGestureHandler onHandlerStateChange={this.onCloseState}>
               <Animated.View style={styles.closeButton}>
                 <Animated.Text style={{fontSize:15,transform:[{rotate: concat(this.rotateCross,'deg')}]}}>X</Animated.Text>
               </Animated.View>
           </TapGestureHandler>
           {/* Email input */}
           <TextInput placeholder='USERNAME' value={this.state.username} onChangeText={text=>this.onchange('username',text)} style={styles.textInput} placeholderTextColor='black'></TextInput>
           {/* Password input */}
           <TextInput  placeholder='PASSWORD'value={this.state.password} onChangeText={text=>this.onchange('password',text)} style={styles.textInput} placeholderTextColor='black'></TextInput>
           {/* Signin Botton 2  */}
           <TouchableOpacity onPress={this.handleSubmit}>
           <Animated.View style={styles.button}>
                <Text style={{fontSize:20,fontWeight:'bold'}} >SIGN IN</Text>
          </Animated.View>
          </TouchableOpacity>
          </Animated.View >
        </View>
      </View>
    );
  }
}
export default MusicApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: 'white',
    height: 70,
    marginHorizontal: 20,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    shadowOffset:{width:2,height:2},
    shadowColor:'black',
    shadowOpacity:0.2
  },
  closeButton:{
    height:40,
    width:40,
    backgroundColor:'white',
    borderRadius:20,
    alignItems:'center',
    justifyContent:'center',
    position:'absolute',
    top:-20,
    left:width/2 -20,
    shadowOffset:{width:2,height:2},
    shadowColor:'black',
    shadowOpacity:0.2
  },
    textInput:{
    height:50,
    borderRadius:25,
    borderWidth:0.5,
    marginHorizontal:20,
    paddingLeft:10,
    marginVertical:5,
    borderColor:'rgba(0,0,0,0.2)'
  }
}); 