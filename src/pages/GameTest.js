import { Button, Modal } from 'antd'
import React, {useState} from 'react'
import SearchContainer from '../components/SearchContainer'

const GameTest = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const toggleSearch = () => {
    setIsSearchVisible(prev => !prev)
  }

  const handleCancel = () => {
    setIsSearchVisible(false)
  }
  return (
    <div>
      <Button onClick={toggleSearch}> Open Search </Button>
      <Modal visible={isSearchVisible} width={1000} onCancel={handleCancel} footer={null}> 

        <SearchContainer/>

      </Modal>
      
    </div>
  )
}

export default GameTest
