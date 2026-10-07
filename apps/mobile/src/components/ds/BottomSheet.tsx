import React, { forwardRef, useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetModalProps, BottomSheetView } from '@gorhom/bottom-sheet';
import { useTheme } from '../../hooks/useTheme';

export interface CustomBottomSheetProps extends Omit<BottomSheetModalProps, 'snapPoints' | 'children'> {
  snapPoints?: string[];
  children: React.ReactNode;
}

export const BottomSheet = forwardRef<BottomSheetModal, CustomBottomSheetProps>(
  ({ snapPoints = ['50%', '90%'], children, ...props }, ref) => {
    const theme = useTheme();

    const renderBackdrop = useCallback(
      (backdropProps: any) => (
        <BottomSheetBackdrop
          {...backdropProps}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
        />
      ),
      []
    );

    const backgroundStyle = useMemo(
      () => ({
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius['2xl'],
      }),
      [theme]
    );

    const handleIndicatorStyle = useMemo(
      () => ({
        backgroundColor: theme.colors.border,
        width: 40,
      }),
      [theme]
    );

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        backgroundStyle={backgroundStyle}
        handleIndicatorStyle={handleIndicatorStyle}
        {...props}
      >
        <BottomSheetView style={styles.contentContainer}>
          {children}
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

BottomSheet.displayName = 'BottomSheet';

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 24,
  },
});
