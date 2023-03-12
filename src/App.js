import React from 'react';
import './App.css';
import TinderCard from 'react-tinder-card'

document.body.style.overflow = "hidden"

const db = [
  {
    name: 'Richard Hendricks',
    url: 'https://cs12.pikabu.ru/post_img/big/2021/03/20/7/1616234733184515578.png'
  },
  {
    name: 'Erlich Bachman',
    url: 'https://cs12.pikabu.ru/post_img/big/2021/03/20/7/1616234733184515578.png'
  },
  {
    name: 'Monica Hall',
    url: 'https://cs12.pikabu.ru/post_img/big/2021/03/20/7/1616234733184515578.png'
  },
  {
    name: 'Jared Dunn',
    url: 'https://cs12.pikabu.ru/post_img/big/2021/03/20/7/1616234733184515578.png'
  },
  {
    name: 'Dinesh Chugtai',
    url: 'https://cs12.pikabu.ru/post_img/big/2021/03/20/7/1616234733184515578.png'
  }
]

function App() {
  const characters = db
  const [currentIndex, setCurrentIndex] = React.useState(db.length - 1)
  const [lastDirection, setLastDirection] = React.useState()
  const currentIndexRef = React.useRef(currentIndex)

  const childRefs = React.useMemo(
    () =>
      Array(db.length)
        .fill(0)
        .map((i) => React.createRef()),
    []
  )

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val)
    currentIndexRef.current = val
  }

  const canGoBack = currentIndex < db.length - 1

  const canSwipe = currentIndex >= 0

  // set last direction and decrease current index
  const swiped = (direction, nameToDelete, index) => {
    setLastDirection(direction)
    updateCurrentIndex(index - 1)
  }

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current)
    // handle the case in which go back is pressed before card goes outOfFrame
    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard()
    // TODO: when quickly swipe and restore multiple times the same card,
    // it happens multiple outOfFrame events are queued and the card disappear
    // during latest swipes. Only the last outOfFrame event should be considered valid
  }

  const swipe = async (dir) => {
    if (canSwipe && currentIndex < db.length) {
      await childRefs[currentIndex].current.swipe(dir) // Swipe the card!
    }
  }

  // increase current index and show card
  const goBack = async () => {
    if (!canGoBack) return
    const newIndex = currentIndex + 1
    updateCurrentIndex(newIndex)
    await childRefs[newIndex].current.restoreCard()
  }

  const likeClick = () => {
    console.log('Click');
    // childRefs[0].current.swipe('right')
    swipe('right')
  } 

  const crossClick = () => {
    console.log('Click');
    swipe('left')
    // childRefs[0].current.swipe('left')
  } 
  
  return (
    <div className="App">
      <div className="Container">
      <div className='cardContainer'>
        {characters.map((character, index) =>
          <TinderCard ref={childRefs[index]} className='swipe' key={character.name} onSwipe={(dir) => swiped(dir, character.name, index)} onCardLeftScreen={() => outOfFrame(character.name, index)}>
            <div style={{ backgroundImage: 'url(' + character.url + ')' }} className='card'>
              {/* <h3>{character.name}</h3> */}
            </div>
          </TinderCard>
        )}
        <div className='buttonsContainer'>
                <img onClick={crossClick} className='crossImage' src={require('./cross.png')} />
                <img onClick={likeClick} className='likeImage' src={require('./like.png')} />
              </div>
      </div>
      </div>
    </div>
  );
}

export default App;
