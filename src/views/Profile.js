//TODO: 把 renderGallery拉出來變成一個component

import React, { Component } from 'react';
import { View, Dimensions, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { observer } from 'mobx-react/native';
import { Card, ListItem } from 'react-native-elements';
import Reactotron from 'reactotron-react-native';

const { width, height } = Dimensions.get('window');

const styles = {
  viewWrapper: {
    width,
    height,
  },
  container: {
      flex: 1,
      flexDirection: 'row',
  },
  gallery: {
      flexDirection: 'row'
  },
  icon: {
      textAlign: 'center'
  },
  item: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  photo: {
      flex: 1
  }
};

@observer
export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.store = this.props.store;
    this.firebase = this.props.fire;
    this.db = this.props.localdb;
    this.state = {
      size: {
          width,
          height
      },
      tip: null,
    };
  }

  componentWillMount() {
    Reactotron.log('Rendering Profile');
    Actions.refresh({ key: 'drawer', open: false });
  }

  emailPressed = () => {
    this.setState({
      tip: '未認證'
    });
  }

  render() {
    const user = this.store.user;
    const userImg = {uri: user.photoURL};
    const emailVerified = user.emailVerified ? {name: 'beenhere', color: 'skyblue'} : {name: 'report', color: 'orange'};

    return(
      <View style={styles.viewWrapper}>
        <Card
          title='Test Profile'
          containerStyle={{ flex: 1, width: this.state.size.width, margin: 0 }}
          wrapperStyle={{flex: 1}}
          image={userImg}
          >
          <ListItem
            key={user.email}
            title='Email'
            subtitle={user.email}
            rightTitle={this.state.tip}
            rightIcon={emailVerified}
            onPress={this.emailPressed}
            />
        </Card>
      </View>
    );
  }
}
