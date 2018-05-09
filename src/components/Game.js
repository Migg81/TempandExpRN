import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RandomeNumber from './RandomeNumber';
import shuffle from 'lodash.shuffle';

import {
    Platform,
    StyleSheet,
    Text,
    View,
    Button
  } from 'react-native';

  export default class Game extends Component {
    
  gameStatus='PLAYING';  

  static propTypes={
    randomeNumberCount:PropTypes.number.isRequired,
    initialSeconds:PropTypes.number.isRequired,
    onPlayAgain:PropTypes.func.isRequired,
  };
    
  state = {
    selectedIds: [],
    remainingSeconds: this.props.initialSeconds,
  };

  selectNumber = (numberIndex) => {
    this.setState((prevState) => ({
      selectedIds: [...prevState.selectedIds, numberIndex],
    }));
  };
     
    randomeNumbers=Array.from({length:this.props.randomeNumberCount})
                        .map(()=>1 + Math.floor(10 * Math.random()));

    target= this.randomeNumbers.slice(0,this.props.randomeNumberCount-2).reduce((acc,curr)=>acc + curr,0);

    shufflerandomeNumbers=shuffle(this.randomeNumbers);

   componentDidMount(){
     this.intervelId=setInterval(()=>{
     this.setState((prevState)=>{
       return {remainingSeconds:prevState.remainingSeconds-1};
     },()=>{
       if(this.state.remainingSeconds===0){
        clearInterval(this.intervelId);
       }
     })
     },1000)
   };

   componentWillUnmount(){
      clearInterval(this.intervelId);
   }

   componentWillUpdate(nextProps,nextState)
   {
      if(nextState.selectedIds !== this.state.selectedIds || nextState.remainingSeconds===0)
      {
        this.gameStatus=this.calgameStatus(nextState);
        if(this.gameStatus!=='PLAYING'){
          clearInterval(this.intervelId);
        }
      }
   }

   isNumberSelected=(numberIndex)=>{
      return this.state.selectedIds.indexOf(numberIndex) >= 0;
    };

    calgameStatus=(nextState)=>{

      const sumSelected=nextState.selectedIds.reduce((acc,curr)=>
      {
        return acc + this.shufflerandomeNumbers[curr];
      },0)

      if(nextState.remainingSeconds===0)
      {
        return 'LOST';
      }
      if(sumSelected === this.target)
      {
        return 'WON';
      }
      if(sumSelected < this.target)
      {
        return 'PLAYING';
      }
      if(sumSelected > this.target)
      {
        return 'LOST';
      }
    };
    
    render() {
      const  gameStatus=this.gameStatus;
      return (
        <View  style={styles.container}>
            <Text style={[styles.target,styles[`STATUS_${gameStatus}`]]}>{this.target}</Text>
            <Text style={styles.status}>{gameStatus}</Text>
            <Text style={styles.status}>Timer : {this.state.remainingSeconds}</Text>
            <View style={styles.randomContainer}>
              {
                this.shufflerandomeNumbers.map((randamNumber,index) => (
                <RandomeNumber key={index} id={index} 
                number={randamNumber} 
                isDisabled={this.isNumberSelected(index) || gameStatus!=='PLAYING'} 
                onPress={this.selectNumber}/>
              ))}
            </View>
            {this.gameStatus!=='PLAYING' && (
            <Button
              style={{fontSize: 20, color: 'green'}}
              styleDisabled={{color: 'red'}}
              onPress={this.props.onPlayAgain} title="Play Again!">
            </Button>)}
        </View>
      );
    }
  }


  const styles = StyleSheet.create({
    container: {
      backgroundColor: '#ddd',
      flex: 1,
    },
  
    target: {
      fontSize: 50,
      backgroundColor: '#bbb',
      margin: 50,
      textAlign: 'center',
    },
    status: {
      color: 'blue',
      textAlign: 'center',
    },
  
    randomContainer: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
    },

    random: {
      backgroundColor: "#9999",
      width: 100,
      marginHorizontal: 15,
      marginVertical: 25,
      fontSize: 35,
      textAlign:'center'
    },
  
    STATUS_PLAYING: {
      backgroundColor: '#bbb',
    },
  
    STATUS_WON: {
      backgroundColor: 'green',
    },
  
    STATUS_LOST: {
      backgroundColor: 'red',
    },
  });
