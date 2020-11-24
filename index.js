import React, { useState, useEffect } from 'react';
import TargetList from './src/TargetList';
import SourceList from './src/SourceList';
import { View } from 'react-native';
const Grouper = (props) => {
  const target = props.children[0]; //TargetList
  const middle = props.children[1]; //View behind the Lists
  const source = props.children[2]; //SourceList
  const listOffset = props.listOffset ? props.listOffset : 0;
  const horizontal = true; // currently only true is possible
  const deceleration = props.deceleration ? props.deceleration : 0.992;
  const duration = props.duration ? props.duration : 400;
  const targetStyle = target.props.style;
  const sourceStyle = source.props.style;
  const listItemWidth = sourceStyle.width ? sourceStyle.width : 40;
  const listItemHeight = sourceStyle.height ? sourceStyle.height : 40;
  const [targetListLocation, setTargetListLocation] = useState(0);
  const [sourceListLocation, setSourceListLocation] = useState(0);
  let numOfChildren;
  if (source.props.children) {
    if (source.props.children.length) {
      numOfChildren = source.props.children.length;
    }
    else
      numOfChildren = 1;
  }
  else
    numOfChildren = 0;
  const [sourceCounter, setSourceCounter] = useState(numOfChildren);
  const [targetCounter, setTargetCounter] = useState(0);
  const sourceDataArray = numOfChildren > 1 ? source.props.children.map((el) => el) : [source.props.children];
  const [sourceData, setSourceData] = useState(sourceDataArray);
  const [targetData, setTargetData] = useState([]);
  useEffect(() => {
    const targetDataArray = targetData.length ? targetData.map(el => el.props.value) : [];
    props.setValues(targetDataArray);
  }, [targetData, sourceData]);
  const sendItems = (item) => {
    setTargetData((list) => [...list, item]);
  };
  const returnItems = (item) => {
    setSourceData((list) => [...list, item]);
  };
  const sendTargetLocation = (y) => {
    setTargetListLocation(y);
  };
  const sendSourceLocation = (y) => {
    setSourceListLocation(y);
  };
  return (<View style={{
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  }}>
    {[
      React.cloneElement(target, {
        key: Math.random().toString(),
        targetData,
        horizontal,
        deceleration,
        duration,
        listOffset,
        sendTargetLocation,
        returnItems,
        targetStyle,
        listItemWidth,
        listItemHeight,
        sourceListLocation,
        targetCounter,
        setTargetCounter,
        sourceCounter,
        setSourceCounter //set num. of items in SourceList
      }),
      React.cloneElement(middle, {
        key: Math.random().toString()
      }),
      React.cloneElement(source, {
        key: Math.random().toString(),
        sourceData,
        horizontal,
        listOffset,
        deceleration,
        duration,
        sendSourceLocation,
        sendItems,
        targetListLocation,
        sourceStyle,
        listItemWidth,
        listItemHeight,
        targetCounter,
        setTargetCounter,
        sourceCounter,
        setSourceCounter //set num. of items in SourceList
      }),
    ]}
  </View>);
};
export { SourceList, TargetList, Grouper };
//# sourceMappingURL=Grouper.js.map