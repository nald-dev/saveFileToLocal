import React, { useEffect, useState } from 'react'
import { Image, Platform, View } from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage'
import RNFetchBlob from 'rn-fetch-blob'

const imageURLs =  [
  {
    key: 'Picollo',
    url: 'https://images.unsplash.com/photo-1643103547026-fd2745d67cbc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80'
  },
  {
    key: 'Terrace',
    url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80'
  }
]

const selectedKey = 'Picollo'

function App() {
  const selectedItem = imageURLs.find(item => item.key === selectedKey)

  const [imagePath, setImagePath] = useState(null)

  useEffect(() => {
    loadImage()
    downloadImage()
  }, [])

  return (
    <View
      style = {{
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center'
      }}
    >
      <Image
        source={{uri: imagePath}}
        style = {{
          backgroundColor: 'gray',
          height: 300,
          width: 300
        }}
      />
    </View>
  )

  async function loadImage() {
    const savedImagePath = await AsyncStorage.getItem(`${selectedItem.key}-image`)

    if (savedImagePath) {
      console.log(`${Platform.OS} Loading Image`)

      setImagePath(savedImagePath)
    } else {
      console.log(`${Platform.OS} Downloading Image`)

      downloadImage()
    }
  }

  function downloadImage() {
    const {dirs} = RNFetchBlob.fs

    RNFetchBlob
    .config({
      fileCache: true,
      path: `${dirs.DocumentDir}/${(new Date()).toISOString()}`
    })
    .fetch('GET', selectedItem.url, {
      'Authorization': '',
      'Content-Type': 'application/octet-stream'
    })
    .then(async (res) => {
      // the temp file path
      if (res && res.path()) {
        const filePath = `file://${res.path()}`

        await AsyncStorage.setItem(`${selectedItem.key}-image`, filePath)

        setImagePath(filePath)
      }
    })
    .catch((error) => {
      console.log(error)
    })
  }
}

export default App