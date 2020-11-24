import React, { useState, useEffect, useRef } from 'react';
import { FlatList, Image, View, Text, PanResponder, Animated } from 'react-native';
const TargetList = (props) => {
    const { horizontal, returnItems, sourceListLocation, listItemWidth, listItemHeight, deceleration, duration, listOffset, targetStyle, targetData, sendTargetLocation, targetCounter, setTargetCounter, sourceCounter, setSourceCounter } = props;
    const [targetList, setTargetList] = useState(targetData);
    useEffect(() => {
        if (targetData.length) {
            setTargetList(targetData);
        }
    }, [targetData]);
    const [currentItem, setcurrentItem] = useState({});
    const [hidden, sethidden] = useState(true);
    const [draggingIndex, setdraggingIndex] = useState(-1);
    let animatedItemPoint = useRef(new Animated.ValueXY()).current;
    let currentItemIndex = -1;
    let scrollOffSet = 0;
    let flatListLayoutX = 0;
    const panResponderTarget = React.useRef(PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () => true,
        onMoveShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponderCapture: () => true,
        onPanResponderGrant: (evt, gestureState) => {
            sethidden(false);
            currentItemIndex = xToIndex(gestureState.x0);
            setdraggingIndex(currentItemIndex);
            setcurrentItem(targetList[currentItemIndex]);
            Animated.event([{
                y: animatedItemPoint.y,
                x: animatedItemPoint.x,
            }], { useNativeDriver: false })({
                y: gestureState.y0 - 50 - listItemHeight / 2,
                x: gestureState.x0 - listItemWidth / 2,
            });
            return evt;
        },
        onPanResponderMove: (evt, gestureState) => {
            Animated.event([{
                y: animatedItemPoint.y,
                x: animatedItemPoint.x,
            }], { useNativeDriver: false })({
                y: gestureState.moveY - 50 - listItemHeight / 2,
                x: gestureState.moveX - listItemWidth / 2,
            });
            return evt;
        },
        onPanResponderTerminationRequest: () => false,
        onPanResponderRelease: (evt, gestureState) => {
            const itemToSendBack = targetList[currentItemIndex];
            Animated.decay(animatedItemPoint, {
                useNativeDriver: false,
                velocity: { x: gestureState.vx, y: gestureState.vy },
                deceleration: deceleration,
            }).start(() => {
                Animated.timing(animatedItemPoint, {
                    toValue: {
                        y: sourceListLocation - listOffset,
                        x: (sourceCounter ? sourceCounter : 0) * listItemWidth,
                    },
                    duration: duration,
                    useNativeDriver: false,
                }).start(() => {
                    returnItems(itemToSendBack);
                    setTargetCounter(targetCounter - 1);
                    setSourceCounter(sourceCounter + 1);
                });
            });
            let newTargetList = targetList;
            if (currentItemIndex > -1) {
                newTargetList.splice(currentItemIndex, 1);
            }
            setTargetList(newTargetList);
            return evt;
        },
        onPanResponderTerminate: () => {
        },
        onShouldBlockNativeResponder: () => {
            return true;
        },
    })).current;
    const xToIndex = (x) => {
        return Math.floor((scrollOffSet + x - (flatListLayoutX ? flatListLayoutX : 0)) / listItemWidth);
    };
    const renderData = (item, index) => {
        let renderThisItem;
        if (item) {
            if (item.type.displayName == 'Image')
                renderThisItem = React.createElement(Image, { style: item.props.style, source: item.props.source });
            if (item.type.displayName == 'Text')
                renderThisItem = React.createElement(Text, { style: item.props.style }, item.props.children);
        }
        return (<View {...panResponderTarget.panHandlers} style={[targetStyle,
            { transform: draggingIndex === index ? [{ scale: 0 }] : null }
        ]}>
            {renderThisItem}
        </View>);
    };
    return (<>
        <FlatList horizontal={horizontal} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} data={targetData} renderItem={({ item, index }) => {
            return renderData(item, index);
        }} keyExtractor={(item, index) => index + ''} scrollEventThrottle={16} onLayout={(e) => {
            sendTargetLocation(e.nativeEvent.layout.y);
            flatListLayoutX = e.nativeEvent.layout.x;
        }} />

        {!hidden && (<Animated.View style={{
            top: animatedItemPoint.getLayout().top,
            left: animatedItemPoint.getLayout().left,
            position: 'absolute',
            zIndex: 1
        }}>
            {renderData(currentItem)}
        </Animated.View>)}
    </>);
};
export default TargetList;
//# sourceMappingURL=TargetList.js.map