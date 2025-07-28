import React, { useState, useEffect, useRef } from 'react';
import { Animated, View, Text } from 'react-native';
import styled from 'styled-components/native';
import { MagnifyingGlassIcon } from './icons/MagnifyingGlassIcon';
import { JobCategory } from '../types';

interface FindingWorkerAnimationProps {
  analyzedJobType?: JobCategory | string | null;
}

const BASE_MESSAGES = [
  "Connecting to worker network...",
  "Analyzing your service needs...",
  "Identifying skilled professionals...",
  "Checking real-time availability...",
  "Cross-referencing worker ratings...",
  "Shortlisting top matches for you...",
  "Finalizing recommendations..."
];

const Container = styled(View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(31, 41, 55, 0.75); /* gray-800 with opacity */
  justify-content: center;
  align-items: center;
  z-index: 50;
  padding: 16px;
`;

const AnimationContainer = styled(View)`
  width: 256px;
  height: 256px;
  justify-content: center;
  align-items: center;
`;

const PulseCircle = styled(Animated.View)`
  position: absolute;
  border-width: 2px;
  border-color: #2563eb; /* blue-600 */
  border-radius: 9999px;
`;

const MessageText = styled(Text)`
  margin-top: 32px;
  color: white;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
`;

const PulsingCircle: React.FC<{ delay: number }> = ({ delay }) => {
    const pulseAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(pulseAnim, {
                toValue: 1,
                duration: 2000,
                delay,
                useNativeDriver: true,
            })
        ).start();
    }, [pulseAnim, delay]);

    const scale = pulseAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.8, 1.5],
    });

    const opacity = pulseAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.8, 0.2, 0],
    });

    return (
        <PulseCircle
            style={{
                width: '100%',
                height: '100%',
                opacity,
                transform: [{ scale }],
            }}
        />
    );
};


export const FindingWorkerAnimation: React.FC<FindingWorkerAnimationProps> = ({ analyzedJobType }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [statusMessages, setStatusMessages] = useState<string[]>(BASE_MESSAGES);

  useEffect(() => {
    if (analyzedJobType) {
      const updatedMessages = [...BASE_MESSAGES];
      updatedMessages[1] = `Analyzing your service needs for: ${analyzedJobType}`;
      setStatusMessages(updatedMessages);
    }
  }, [analyzedJobType]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % statusMessages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [statusMessages.length]);

  return (
    <Container>
      <AnimationContainer>
        <PulsingCircle delay={0} />
        <PulsingCircle delay={500} />
        <PulsingCircle delay={1000} />
        <MagnifyingGlassIcon height={64} width={64} color="#2563eb" />
      </AnimationContainer>
      <MessageText>
        {statusMessages[currentMessageIndex]}
      </MessageText>
    </Container>
  );
};