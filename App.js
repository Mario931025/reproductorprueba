import React from 'react'
import { StyleSheet, TouchableOpacity, View, Image,Text,ScrollView,StatusBar,Dimensions } from 'react-native'
import { Icon } from 'react-native-elements'
import { Ionicons } from '@expo/vector-icons'
import { Audio } from 'expo-av'
import { LinearGradient } from 'expo-linear-gradient'
import { BlurView } from 'expo-blur'
const {height, width} = Dimensions.get("window")

const audioBookPlaylist = [
  {
    title: '挨拶- Saludos',
    author: 'BUNKAN NICHIBOKU',
    source: 'Audio 1',
    uri:
      'https://firebasestorage.googleapis.com/v0/b/bunkan-app-8d29e.appspot.com/o/Auditivos%2F05%20Pista%205.mp3?alt=media&token=fda68b76-4ecc-4df1-ad2c-f7069c10cbc5',
    imageSource: 'https://firebasestorage.googleapis.com/v0/b/bunkan-app-8d29e.appspot.com/o/Imagenes%2FBunkanLogo_Drawer.png?alt=media&token=08c41392-8ed3-42ff-816f-c51e50043f25',
    textoJapones:`1. おはようございます。(x2) 
    2. こんにちは(x2)
    3. こんばんは(x2) 
    4.さようなら(x2)
    5.-すみません　-いいえ
    6.-どうぞ
    －ありがとうございます。
    -いいえ
    7.どうぞ 
    -しつれいします`,
    textoEspañol:`1. Buenos días.(x2) 
    ２．Buenas tardes(x2)
    3. Buenas noches(x2 en la calle) 
    4. Adios
    5. Disculpa  -No hay problema
    6.Aqui tienes 
    -Muchas gracias 
    -No hay de que
    7.Adelante, pasa
    -Con permiso`
                　
    
  },
  {
    title: 'Hamlet - Act II',
    author: 'William Shakespeare',
    source: 'Librivox',
    uri:
      'https://ia600204.us.archive.org/11/items/hamlet_0911_librivox/hamlet_act2_shakespeare.mp3',
    imageSource: 'http://www.archive.org/download/LibrivoxCdCoverArt8/hamlet_1104.jpg'
  },
  {
    title: 'Hamlet - Act III',
    author: 'William Shakespeare',
    source: 'Librivox',
    uri: 'http://www.archive.org/download/hamlet_0911_librivox/hamlet_act3_shakespeare.mp3',
    imageSource: 'http://www.archive.org/download/LibrivoxCdCoverArt8/hamlet_1104.jpg'
  },
  {
    title: 'Hamlet - Act IV',
    author: 'William Shakespeare',
    source: 'Librivox',
    uri:
      'https://ia800204.us.archive.org/11/items/hamlet_0911_librivox/hamlet_act4_shakespeare.mp3',
    imageSource: 'http://www.archive.org/download/LibrivoxCdCoverArt8/hamlet_1104.jpg'
  },
  {
    title: 'Hamlet - Act V',
    author: 'William Shakespeare',
    source: 'Librivox',
    uri:
      'https://ia600204.us.archive.org/11/items/hamlet_0911_librivox/hamlet_act5_shakespeare.mp3',
    imageSource: 'http://www.archive.org/download/LibrivoxCdCoverArt8/hamlet_1104.jpg'
  }
]

export default class App extends React.Component {
  state = {
    isPlaying: false,
    playbackInstance: null,
    currentIndex: 0,
    volume: 1.0,
    isBuffering: false
  }

  async componentDidMount() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
        shouldDuckAndroid: true,
        staysActiveInBackground: true,
        playThroughEarpieceAndroid: true
      })
 
      this.loadAudio()
    } catch (e) {
      console.log(e)
    }
  }

  
async loadAudio() {
  const {currentIndex, isPlaying, volume} = this.state
 
  try {
    const playbackInstance = new Audio.Sound()
    const source = {
      uri: audioBookPlaylist[currentIndex].uri
    }
 
    const status = {
      shouldPlay: isPlaying,
      volume
    }
 
    playbackInstance.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate)     
    await playbackInstance.loadAsync(source, status, false)
    this.setState({playbackInstance})
    } catch (e) {
      console.log(e)
    }
}
 
onPlaybackStatusUpdate = status => {
  this.setState({
    isBuffering: status.isBuffering
  })
}

handlePlayPause = async () => {
  const { isPlaying, playbackInstance } = this.state
  isPlaying ? await playbackInstance.pauseAsync() : await playbackInstance.playAsync()

  this.setState({
    isPlaying: !isPlaying
  })
}

  handlePreviousTrack = async () => {
  let { playbackInstance, currentIndex } = this.state
  if (playbackInstance) {
    await playbackInstance.unloadAsync()
    currentIndex < audioBookPlaylist.length - 1 ? (currentIndex -= 1) : (currentIndex = 0)
    this.setState({
      currentIndex
    })
    this.loadAudio()
  }
}

handleNextTrack = async () => {
  let { playbackInstance, currentIndex } = this.state
  if (playbackInstance) {
    await playbackInstance.unloadAsync()
    currentIndex < audioBookPlaylist.length - 1 ? (currentIndex += 1) : (currentIndex = 0)
    this.setState({
      currentIndex
    })
    this.loadAudio()
  }
}

renderFileInfo() {
  const { playbackInstance, currentIndex } = this.state
  return playbackInstance ? (
    
    <View style={styles.trackInfo}>
      <Text style={[styles.trackInfoText, styles.largeText]}>
        {audioBookPlaylist[currentIndex].title}
      </Text>
      <Text style={[styles.trackInfoText, styles.smallTextAuthor, ]}>
        {audioBookPlaylist[currentIndex].author}
      </Text>
      <Text style={[styles.trackInfoText, styles.smallTextSource]}>
        {audioBookPlaylist[currentIndex].source}
      </Text>
      <View style={[ styles.box]}>
      <Text style={[styles.trackInfoText, styles.smallText]}>
        {audioBookPlaylist[currentIndex].textoJapones}
      </Text>
      <Text style={[styles.trackInfoTextEsp, styles.smallText]}>
        {audioBookPlaylist[currentIndex].textoEspañol}
      </Text>
      </View>
    </View>
   
  ) : null
}



render() {
  return (
    
  <View style={styles.containerprincipal}>
    <ScrollView style={{
            flex:1,
            //borderWidth:1,
            //borderColor:"red",
            width:width
            
            }}
            showsVerticalScrollIndicator={false}
        >
           <StatusBar translucent backgroundColor={"transparent"}/>

           <View style={styles.header}>
                <Image 
                    source={require("./assets/audio.png")}
                    style={styles.imagenBGheader}
                />
                <LinearGradient
                        //Background Linear Gradient
                        colors={["#333333", "transparent"]}
                        style={styles.lg}
                />
                <View 
                    style={{
                        //borderWidth:3,
                        borderColor:"black",
                        top:50,
                        left:35,
                    }}>
                    <TouchableOpacity 
                        style={styles.btnBack}
                        onPress={()=>navigation.goBack()}
                    >
                        <Icon
                            name="chevron-left"
                            type="material-community"
                            size={25}
                            color="#E4253F"
                            style={{padding:0,justifyContent:'center',}}
                        />
                    </TouchableOpacity>
                </View>
                
                <View style={styles.controls}>
                <BlurView intensity={200} tint={'default'} style={{flex:1 ,height:125,flexDirection:"row",paddingLeft:50}}>
        <TouchableOpacity style={styles.control} onPress={this.handlePreviousTrack}>
          <Ionicons name='caret-back-outline' size={48} color='#444' />
        </TouchableOpacity>

        <TouchableOpacity style={styles.control} onPress={this.handlePlayPause}>
          {this.state.isPlaying ? (
            <Ionicons name='pause-circle' size={48} color='#444' />
          ) : (
            <Ionicons name='ios-play-circle' size={48} color='#444' />
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.control} onPress={this.handleNextTrack}>
          <Ionicons name='caret-forward-outline' size={48} color='#444' />
        </TouchableOpacity>

        </BlurView>
                </View>

                
            </View>



            <View style={styles.body}>
                <View style={{backgroundColor:"#e6cbe0", height:8, width:"18%", marginTop:15, borderRadius:10 }}/>
                <View style={{alignItems:'center',justifyContent:'center',alignContent:'center',alignSelf:'center', }}>
                    <Text style={styles.titulo}>聴解</Text>
                </View>
                <View style={{alignItems:'center',justifyContent:'center',alignContent:'center',alignSelf:'center', }}>
                    <Text style={styles.descri}>Te sugerimos dominar hiragana y Katakana</Text>
                    <Text style={styles.descri2}>Puedes verlo en japonés y despues español</Text>
                    
                </View>
                {this.renderFileInfo()}
            </View>

          
  

        </ScrollView>
  </View>
     
     
   
  )
}
}



 
// update the Stylesheet object 
const styles = StyleSheet.create({
  containerprincipal:{
    flex:1,
    justifyContent:'center',
    alignContent:'center',
    alignItems:'center',
    alignSelf:'center',
    width:"100%",
  },
  header: {
    flex:1,
        //borderWidth:1,
        borderColor:"black",
        width:"100%",
        height:517,
        borderBottomLeftRadius:15,
        borderBottomRightRadius:15,
        //position:'absolute',
        //overflow:'hidden'
  },
    btnBack:{
        justifyContent:'center',
        alignContent:'center',
        alignItems:'center',
        //alignSelf:'center',
        width:74,
        height:74,
        borderRadius:17,
        backgroundColor:"#FAFAFA",
        shadowColor:"black",
        shadowRadius:10,// sombra al raido
        shadowOffset:{height:15},
        shadowOpacity:0.7,// da una opacidad
        elevation:20
    },
  container1:{
    flex:1,
    //borderWidth:1,
    //borderColor:"red",
    width:width
  },
    imagenBGheader:{
        width:430,
        height:420,
        left: -401,
        top:-27,
        position:'absolute',
        marginLeft:350
    },
  albumCover: {
    width: 250,
    height: 250
  },
  trackInfo: {
    padding: 40,
    backgroundColor: '#fff'
  },
  box:{
    borderColor:"#efa9ae",
        borderWidth:3,
        borderRadius:20,
        paddingVertical:10,
        shadowColor:"#FFF0EB",
        shadowRadius:5,// sombra al raido
        shadowOffset:{height:10},
        shadowOpacity:0.2,// da una opacidad
        //elevation:2,
        marginBottom:15,
        marginTop:-75,
       // height:200
        
  },
    body:{
        flex:1,
        backgroundColor:"#FEFEFE",
        alignItems:'center',
        //justifyContent:'center',
        alignContent:'center',
        alignSelf:'center',
        //borderWidth:1,
        borderColor:"black",
        width:"100%",
        top:-160,
        borderTopRightRadius:40,
        borderTopLeftRadius:40,
        marginBottom:-100
    },
    titulo:{
        //flex:1,
        fontSize:30,
        fontWeight:'bold',
        //fontFamily:"MontserratBold",
        letterSpacing:1,
        marginTop:10,
        //borderWidth:1,
        borderColor:"black",
    },
  smallTextAuthor:{
    paddingBottom:-45
  },
  smallTextSource:{
    paddingBottom:80,
    fontSize: 20,
    
  },

  trackInfoText: {
    textAlign: 'center',
    flexWrap: 'wrap-reverse',
    color: '#550088',
   // borderWidth:3,
   // borderColor:"#efa9ae",
  },
  trackInfoTextEsp:{
    textAlign: 'center',
    flexWrap: 'wrap',
    color: '#550088',
    
    //marginTop:20
  },
  largeText: {
    fontSize: 25,
    marginTop:-45

  },
  smallText: {
    fontSize: 16,
    height:250,
    
  },
  control: {
    margin: 20
  },
  controls: {
    flexDirection: 'row',
    borderWidth:3,
   // borderColor:"#efa9ae",
    marginTop:185,
    
  },
  lg:{
    position: "absolute",
    left: 0,
    right: 0,
    top: -300,
    height: "100%",
    //borderWidth:3,
    //borderColor:"black",
},
    descri:{
        //flex:1,
        fontSize:16,
        fontWeight:'400',
       // fontFamily:"Arial",
        width:"85%",
        //borderWidth:1,
        borderColor:"black",
        marginTop:10
        
    },
    descri2:{
        fontSize:16,
        fontWeight:'400',
        width:"85%",
        //borderWidth:1,
        borderColor:"black",
       // fontFamily:"Arial"
    },
})