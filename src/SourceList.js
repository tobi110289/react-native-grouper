import React, { useState, useRef } from 'react';
import { Animated, Text, FlatList, Image, PanResponder, View, } from 'react-native';
const SourceList = (props) => {
    const { horizontal, sendItems, targetListLocation, listItemWidth, listItemHeight, listOffset, deceleration, duration, sourceStyle, sourceData, sendSourceLocation, targetCounter, setTargetCounter, sourceCounter, setSourceCounter } = props;
    const [sourceList, setsourceList] = useState(sourceData);
    const [currentItem, setcurrentItem] = useState();
    const [hidden, sethidden] = useState(true);
    const [draggingIndex, setdraggingIndex] = useState(-1);
    let animatedItemPoint = useRef(new Animated.ValueXY()).current;
    let currentItemIndex = -1;
    let scrollOffSet = 0;
    let flatListLayoutX = 0;
    const panResponder = React.useRef(PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () => true,
        onMoveShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponderCapture: () => true,
        onPanResponderGrant: (evt, gestureState) => {
            sethidden(false);
            currentItemIndex = xToIndex(gestureState.x0);
            setdraggingIndex(currentItemIndex);
            setcurrentItem(sourceList[currentItemIndex]);
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
            const itemToSend = sourceList[currentItemIndex];
            let newSourceList = sourceList;
            if (currentItemIndex > -1) {
                newSourceList.splice(currentItemIndex, 1);
            }
            setsourceList(newSourceList);
            Animated.decay(animatedItemPoint, {
                useNativeDriver: false,
                velocity: { x: gestureState.vx, y: gestureState.vy },
                deceleration: deceleration,
            }).start(() => {
                Animated.timing(animatedItemPoint, {
                    toValue: {
                        y: targetListLocation + listOffset,
                        x: targetCounter * listItemWidth,
                    },
                    duration: duration,
                    useNativeDriver: false,
                }).start(() => {
                    sendItems(itemToSend);
                    setTargetCounter(targetCounter + 1);
                    setSourceCounter(sourceCounter - 1);
                });
            });
            return evt;
        },
        onShouldBlockNativeResponder: () => {
            return true;
        },
    })).current;
    const xToIndex = (x) => {
        return Math.floor((scrollOffSet + x - flatListLayoutX) / listItemWidth);
    };
    const renderData = (item, index) => {
        let renderThisItem;
        if (item) {
            if (item.type.displayName == 'Image')
                renderThisItem = React.createElement(Image, { style: item.props.style, source: item.props.source });
            if (item.type.displayName == 'Text')
                renderThisItem = React.createElement(Text, { style: item.props.style }, item.props.children);
        }
        return (<View {...panResponder.panHandlers} style={[sourceStyle,
            { transform: draggingIndex === index ? [{ scale: 0 }] : null }
        ]}>
            {renderThisItem}
        </View>);
    };
    return (<>
        <FlatList data={sourceList} renderItem={({ item, index }) => {
            return renderData(item, index);
        }} keyExtractor={(item, index) => index + ''} horizontal={horizontal} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} style={{ position: 'absolute' }} scrollEventThrottle={16}
            // onScroll={e => scrollOffSet = e.nativeEvent.contentOffset.x}
            onLayout={(e) => {
                sendSourceLocation(sourceCounter > 0 ? e.nativeEvent.layout.y : e.nativeEvent.layout.y - listItemHeight);
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
export default SourceList;
//# sourceMappingURL=SourceList.js.map