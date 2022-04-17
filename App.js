import React from 'react'
import { StyleSheet, TouchableOpacity, View, Image,Text,ScrollView,StatusBar } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Audio } from 'expo-av'


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
    
    <ScrollView style={styles.container1}> 
    
    <View style={styles.container}>
      <Image
        style={styles.albumCover}
        source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/bunkan-app-8d29e.appspot.com/o/Imagenes%2Ftori1.png?alt=media&token=980dfc53-8e58-4d56-a8de-794d419879f3' }}
      />
      <View style={styles.controls}>
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
      </View>
      {this.renderFileInfo()}
    </View>
    </ScrollView>
   
  )
}
}



 
// update the Stylesheet object 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container1:{
    backgroundColor: "#fff",
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
    flexDirection: 'row'
  }
})