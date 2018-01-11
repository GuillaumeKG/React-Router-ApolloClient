import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Row, Input, Button, Icon, Modal } from 'react-materialize'
import axios from 'axios'

import CreatePost from 'Components/Post/CreatePost'

import './FixedActionBtn.scss'

class FixedActionBtn extends React.Component {

  render() {
    return (
      <Button floating fab='vertical' icon='add' className='darkgreen' large style={{ bottom: '45px', right: '24px' }}>
        <Modal
          header='Modal Header'
          trigger={<Button floating icon='image' className='red' />}>
          <CreatePost />  
        </Modal>
        <Button floating icon='video_label' className='yellow darken-1' />
        <Button floating icon='subject' className='green' />
      </Button>
    )
  }
}

export default FixedActionBtn