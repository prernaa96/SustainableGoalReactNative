import { StatusBar } from 'expo-status-bar';
import React , { useState, useEffect }from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Button, TextInput, Image, ImageBackground } from 'react-native';
import { Checkbox } from 'react-native-paper';
//import CheckBox from '@react-native-community/checkbox';
import { NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { Entypo } from '@expo/vector-icons';
import DatePicker from 'react-native-datepicker'
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import { Marker } from 'react-native-maps';
import Moment from 'moment';
import { FontAwesome5 } from '@expo/vector-icons';
import mainImg from './assets/zerohunger2.png';
import food from './assets/food.jpeg';
import zhImg1 from './assets/zh2.png';
import YoutubePlayer from 'react-native-youtube-iframe';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen name="Welcome!" component={MainScreen} />
        <Stack.Screen name="What would you like to do?" component={HomeScreen} />
        <Stack.Screen name="Location" component={locationScreen}/>
        <Stack.Screen name="Food Condition" component={FoodConditionScreen}/>
        <Stack.Screen name="View Access Points" component={MapScreen}/>
        <Stack.Screen name="Confirmation" component={ConfirmationScreen}/>
        <Stack.Screen name="Learn more about the mission" component={VideoScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function VideoScreen(props){
  return(
    <View>
    <View>
      <YoutubePlayer
        height={300}
        play={true}
        videoId={'iteCytv0RqY'}
      />
    </View>
    <View>
    <YoutubePlayer
      height={300}
      play={true}
      videoId={'DNCL-1ASmNc'}
    />
  </View>
  </View>
  )
}

function MainScreen(props) {
  return(
  <View>
    <View>
    <ImageBackground source = {zhImg1} style={{height:480, width:410, flex:1}}></ImageBackground>
    <TouchableOpacity
       onPress={()=>props.navigation.navigate("What would you like to do?")}  >
       
       <Text style={{marginLeft: 90, marginTop: 500, fontSize: 30, fontFamily: "Baskerville", color: "gray"}}>Tap to continue</Text>
      </TouchableOpacity>
    </View> 
    <View>
      <Text style={{marginLeft: 76, marginTop: 20, fontSize: 20, fontFamily: "Baskerville", color: "gray"}}
      onPress={()=>props.navigation.navigate("Learn more about the mission", {})} 
      >Learn more about this cause
      </Text>
    </View>
  </View>
  )
}

function HomeScreen(props) {

  const [loc, setLoc] = useState(null);

  const getLocation = async() =>{
    let {status} = await Location.requestForegroundPermissionsAsync();

    if(status != "granted"){
      console.log("error");
      return;
    }
    let result = await Location.getCurrentPositionAsync();
    setLoc(result);
  }

  useEffect(()=>{
    getLocation();
  },[])

  let latitude = 39.1745205;
  let longitude = -86.5158012;

  if (loc){
    latitude = loc.coords.latitude;
    longitude = loc.coords.longitude;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
       onPress={()=>props.navigation.navigate("Location", {"latitude":latitude, "longitude":longitude, "screen": 1})}  >
        <View style={styles.mainGive}>
        <Text style={styles.textNeed}>Give</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={()=>props.navigation.navigate("Location", {"latitude":latitude, "longitude":longitude, "screen": 0})}>
        <View style={styles.mainNeed}>
          <Text style={styles.textNeed}>Need</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

function locationScreen(props){
  const [locGeo, setLocGeo] = useState("");
  const [locRevGeo, setLocRevGeo] = useState("");
  const [latitudeLoc, setLatitudeLoc] = useState(props.route.params.latitude);
  const [longitudeLoc, setLongitudeLoc] = useState(props.route.params.longitude);
  const [value, onChangeText] = useState("")
  const [screenFlag, setScreenFlag] = useState(props.route.params.screen)

  const getLocationReverseGeocode = async() =>{
    let {status} = await Location.requestForegroundPermissionsAsync();

    if(status != "granted"){
      console.log("error");
      return;
    }
    let keys={
      latitude: latitudeLoc, 
      longitude: longitudeLoc
    }
    let result = await Location.reverseGeocodeAsync(keys);
    let finalResult = result[0].name + "," + result[0].country + "," + result[0].postalCode
    setLocRevGeo(finalResult);
  }
  const getLocationGeocode = async(userTypedLoc) =>{
    let {status} = await Location.requestForegroundPermissionsAsync();

    if(status != "granted"){
      console.log("error");
      return;
    }
    let result = await Location.geocodeAsync(userTypedLoc);
    setLocGeo(result);
    var lat = result[0].latitude;
    var lon = result[0].longitude
    setLatitudeLoc(lat);
    setLongitudeLoc(lon);
  }
  
  return (
    <View style ={{justifyContent:"center", alignItems:"center"}}>
      <Text style={styles.locationText}>Add your location</Text>
      <View></View>
      <View style={{ flexDirection: 'row'}}>
        <TextInput placeholder="Type your location" onChangeText={text=>onChangeText(text)}
         value={value} style={{borderColor: "grey", borderWidth: 2, height:30, width:250}}></TextInput>
      </View>
      <FontAwesome5 name="search-location" size={24} color="grey" style={{marginBottom:0, marginLeft:-300, marginTop:-30}}
      onPress={()=>getLocationGeocode(value)}/>
      
      <Text style={{marginTop:20,marginBottom:10}}>OR</Text> 
      <View style={{ flexDirection: 'row'}}>
        <Entypo name="location-pin" size={24} color="black" />
        <Text style = {{marginTop:4}} onPress={()=>getLocationReverseGeocode()}>Detect your location</Text>
      </View>
      <View style={{marginTop: 20}}>
        {locRevGeo?<Text>Location: {locRevGeo}</Text>: null}
      </View>
      <View style={styles.nextButtonLoc}>
      {screenFlag? <Button
          title="Next"
          onPress={()=>props.navigation.navigate("Food Condition", {"latitude":latitudeLoc, "longitude":longitudeLoc, "screen": 1})}
      />: <Button
      title="Next"
      onPress={()=>props.navigation.navigate("View Access Points", {"latitude":latitudeLoc, "longitude":longitudeLoc, "screen": 0})}
  />}
      <Entypo name="arrow-right" size={24} color="orange" style={{marginLeft:120, marginTop:-28}}/>
      </View>
      <ImageBackground source = {mainImg} resizeMode = "cover" style={{height:220, width:380, marginTop:20}}></ImageBackground>
    </View>
    
  );
}

function FoodConditionScreen(props){
  var latitude = props.route.params.latitude;
  var longitude = props.route.params.longitude;
  var dt = new Date();
  const [checked, setChecked] = useState(false);
  const [checkedCooked, setCheckedCooked] = useState(false);
  const [date, setDate] = useState(Moment(dt).format('YYYY-MM-DD'));
  const [camImage, setCamImage] = useState(null);
  const [image, setImage] = useState(null);
  const [flag, setFlag] = useState("");
  Moment.locale('en');

  const openLibrary = async()=>{
    setFlag(true);
    const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if(status!= "granted"){
      alert("error-media library permission not granted");
      return;
    }
    const image= await ImagePicker.launchImageLibraryAsync();
    setImage(image.uri)  
  }

  const openCamera = async()=>{
    setFlag(false);
    const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if(status != "granted"){
      alert("error-media library permission not granted");
      return;
    }
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();

    if(cameraStatus.status !== "granted"){
      alert("error-camera permission not granted");
      return;
    }
    const camimage= await ImagePicker.launchCameraAsync();
    setCamImage(camimage.uri)  
  }

  
return(
  <View>
      <View style={styles.panels}>
         <Text>Does your food item require refrigeration?</Text>
         <Checkbox
         boxType='square'
            status={checked ? 'checked' : 'unchecked'}
            onPress={() => {
               setChecked(!checked);
            }}
             color={'green'}
            uncheckColor={'red'}
         /> 
      </View>
      <View style={styles.panels}>
        <Text>Expiry date</Text>
         <DatePicker date={date}
         placeholder="select date"
         mode="date"
         confirmBtnText="Confirm"
         cancelBtnText="Cancel"
         onDateChange={(date) => {
         setDate(date)
        }}/>
     </View>
     <View style={styles.panels}>
         <Text>Is your food item cooked?</Text>
         <Checkbox
         boxType='square'
            status={checkedCooked ? 'checked' : 'unchecked'}
            onPress={() => {
               setCheckedCooked(!checkedCooked);
            }}
            color={'green'}
            uncheckColor={'red'}
         /> 
     </View>
         <Text style={{marginLeft:54, marginBottom:10}}>Additional comments:</Text>
     <TextInput style={{borderColor:"grey", borderWidth:2, width: "50%", height: 50, marginLeft: 95}} type="text"/>
     <View>
    <View style={styles.panels}>
         <Text>Upload Image</Text>
        <View style={{width:175, height:50, marginLeft:-63}}>
           <Button
            title="Choose a photo"
            onPress={openLibrary}
        />
        </View>
        <View style={{width:175, height:35, marginLeft:-240, marginTop: 22}}>
          <Button
            title="Click a photo"
            onPress={openCamera}
        />
        </View>
        </View>
        {/* display image */}
        <View>
        {flag?<Image source = {{uri:image}} style={styles.image}/>:<Image source = {{uri:camImage}} style={styles.image}/>}
        </View>
        <View style={styles.nextButtonFoodCondn}>
        <Button
         title="Next"
         onPress={()=>props.navigation.navigate("View Access Points", {"latitude":latitude, "longitude":longitude, "screen": 1})}
        />
        <Entypo name="arrow-right" size={24} color="orange" style={{marginLeft:120, marginTop:-28}}/>
     </View>
      </View>  
  </View>
  );
}

function MapScreen(props){
  var latitudeCurrent = props.route.params.latitude;
  var longitudeCurrent = props.route.params.longitude;
  const [screenFlag, setScreenFlag] = useState(props.route.params.screen)

  return (
    <View>
    <Text style={{alignItems:"center", fontSize:18, marginLeft:14, marginBottom:10}}>View your location and food drop off points</Text>
    <MapView 
      style={styles.map}
      initialRegion={{
        latitude: latitudeCurrent,
        longitude: longitudeCurrent,
        latitudeDelta:0.01,
        longitudeDelta: 0.01
      }}>
        <Marker
        coordinate = {{latitude: latitudeCurrent,longitude:longitudeCurrent}}
        title="Current location"
        description= "Your location"
        pinColor="red">
        </Marker>  
        <Marker
        coordinate = {{latitude: 39.1745205,longitude:-86.5158012}}
        title="Food Drop off/ Pick up point 1"
        // description= "Your location"
        pinColor="blue">
        </Marker>
        <Marker
        coordinate = {{latitude: 39.1519635,longitude:-86.493524}}
        title="Food Drop off/ Pick up point 2"
        // description= "Your location"
        pinColor="blue">
        </Marker>
       </MapView>
       <View style={styles.nextButtonMap}>
        <Button
          title="Next"
          onPress={()=>props.navigation.navigate("Confirmation", {"screen": screenFlag})}
        /> 
        <Entypo name="arrow-right" size={24} color="orange" style={{marginLeft:120, marginTop:-28}}/>
        </View>
    </View>
  );
}

function ConfirmationScreen(props){
  return (
    <View>
      {props.route.params.screen ? <Text style={styles.confirmText}>Were you able to drop off the food?</Text> : 
    <Text style={styles.confirmText}>Were you able to pick up the food?</Text>}
      <View>
    <ImageBackground source={food} resizeMode = "cover" style={{marginTop:40,height:530, width:380, flex:1,opacity:0.3}} ></ImageBackground>  
    <View>
    <View style={{alignItems :"center", marginTop:100, width:175, height:35, justifyContent:"center", borderRadius: 10, backgroundColor: "green", height: 100, width:150, marginLeft:110}}>
    {props.route.params.screen ? <Button 
    style={{backgroundColor: "green", color: "green" }}
    color="white"
    title="YES"
    onPress={()=>alert("Great! Thanks for helping out")}
    >
    </Button> : <Button 
    style={{backgroundColor: "green", color: "green" }}
    color="white"
    title="YES"
    onPress={()=>alert("Great! Thanks for using our service.")}
    >
    </Button>}
    </View >
    <View style={{alignItems :"center", marginTop:100, width:175, height:35, justifyContent:"center", borderRadius: 10, backgroundColor: "red", height: 100, width:150, marginLeft:110}}>
    <Button 
    color= "white"
    title="NO"
    onPress={()=>alert("No worries! You can try again")}
    ></Button>
   </View>
   </View>
   </View>
    </View>
  );
}



const styles = StyleSheet.create({
  container:{
    backgroundColor: '#fff',
  },mainGive: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: 'gray',
    borderRadius: 4,
    padding: 8,
    margin: 5,
    flexDirection: 'column', 
    backgroundColor: "green",
    height: 270,
  },textGive:{
    fontSize:300,
    alignItems: 'center',
    justifyContent: 'center',
    color: "white"
  },mainNeed:{
    marginTop:-5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: 'gray',
    borderRadius: 4,
    padding: 8,
    margin: 5,
    flexDirection: 'column', 
    backgroundColor: "orange",
    height: 300
  },textNeed:{
    fontSize:70,
    color: "white"
  },panels:{
    borderWidth: 1.5,
    borderColor: 'gray',
    borderRadius: 4,
    padding: 8,
    margin: 10,
    marginLeft: 55,
    flexDirection: 'row', 
    justifyContent: 'space-between',
    width: "70%",
    alignItems: "center"
  },foodContainer:{
    alignItems: "center",
    justifyContent:"center",
    flex:1
  },map:{
    width: 400,
    height:500
  },locationText:{
    // marginTop: -100,
    marginBottom: 80,
    fontWeight:"100",
    fontSize:30,
    fontFamily: "Avenir"
  },image:{
    height:130,
    width:350,
    marginLeft:15
  },nextButtonFoodCondn:{
    // marginTop:100, 
    width:175, 
    height:35, 
    marginLeft:200,
    marginTop:0
  },nextButtonLoc:{
    // marginTop:100, 
    width:175, 
    height:35, 
    marginLeft:200,
    marginTop:70
  },
  nextButtonMap:{
    // marginTop:100, 
    width:175, 
    height:35, 
    marginLeft:200,
    marginTop:15
  },
  confirmText:{
    marginTop: 20,
    fontWeight:"200",
    fontSize:26,
  }
});
