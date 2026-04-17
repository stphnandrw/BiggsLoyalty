import {
  SmallGhostButton,
  SmallPrimaryButton,
} from "@/src/components/ui/Buttons";
import { HeadingText } from "@/src/components/ui/Texts";
import { Fontisto } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Image, Modal, Pressable, Text, View } from "react-native";
import AppCarousel, { CarouselItem } from "./Carousel";

interface ModalProps {
  description?: string;
  route?: any;
  imageRef?: any;
  children?: React.ReactNode;
  visible?: boolean;
  onClose?: () => void;
  voucherItems?: CarouselItem[]; // add
  onVoucherItemPress?: (item: CarouselItem, index: number) => void; // add
}

interface ConfirmBottomSheetProps {
  visible: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

interface AuthRequiredBottomSheetProps {
  visible: boolean;
  title?: string;
  description?: string;
  ctaLabel?: string;
  onClose: () => void;
  onContinue?: () => void;
}

// â”€â”€â”€ CustomModal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function CustomModal({ imageRef, route, description }: ModalProps) {
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    setModalVisible(true);
  }, []);

  const closeModal = () => setModalVisible(false);

  return (
    <View>
      <Modal
        animationType="fade"
        transparent
        visible={true}
        // visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="bg-white p-6 rounded-2xl items-center w-4/5 relative">
            <Pressable
              className="bg-black/10 p-3 rounded-full absolute top-2 right-2"
              onPress={closeModal}
            >
              <Fontisto name="close-a" size={12} color="black" />
            </Pressable>
            <View className="w-full pt-6">
              {imageRef && (
                <Image
                  source={imageRef}
                  className="w-full h-40 mb-4"
                  resizeMode="contain"
                />
              )}
              <Text className="text-base font-bold text-gray-900 text-center">
                {description}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// â”€â”€â”€ VoucherModal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function VoucherModal({
  visible,
  onClose,
  voucherItems = [],
  onVoucherItemPress,
}: ModalProps) {
  const [cardWidth, setCardWidth] = useState(300);
  const closeModal = () => onClose?.();

  return (
    <View>
      <Modal
        animationType="fade"
        transparent
        visible={visible}
        onRequestClose={closeModal}
      >
        <View className="flex-1 items-center justify-center bg-black/50">
          <View
            className="bg-white rounded-2xl items-center justify-center w-4/5 relative pb-3"
            onLayout={(e) => setCardWidth(e.nativeEvent.layout.width)}
          >
            <Pressable
              className="bg-black/50 p-3 rounded-full absolute top-1 right-1 z-20"
              onPress={closeModal}
            >
              <Fontisto name="close-a" size={12} color="white" />
            </Pressable>
            <View className="w-full justify-center items-center overflow-hidden">
              <AppCarousel
                variant="voucher"
                data={voucherItems}
                showPagination
                autoPlay
                width={cardWidth}
                onCtaPress={onVoucherItemPress}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// â”€â”€â”€ AlertModal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function AlertModal({ description, visible, onClose }: ModalProps) {
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => setModalVisible(visible || false), [visible]);

  const closeModal = () => {
    setModalVisible(false);
    onClose?.();
  };

  return (
    <View>
      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="bg-white p-6 rounded-2xl items-center w-4/5 relative border-t-4 border-red-500">
            <Pressable
              className="bg-black/10 p-3 rounded-full absolute top-2 right-2"
              onPress={closeModal}
            >
              <Fontisto name="close-a" size={12} color="black" />
            </Pressable>
            <View className="w-full pt-6 items-center">
              <Fontisto name="close-a" size={32} color="#ef4444" />
              <Text className="text-sm font-semibold text-red-600 text-center mt-3">
                {description}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// â”€â”€â”€ SuccessModal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function SuccessModal({ description, visible, onClose }: ModalProps) {
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => setModalVisible(visible || false), [visible]);

  const closeModal = () => {
    setModalVisible(false);
    onClose?.();
  };

  return (
    <View>
      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="bg-white p-6 rounded-2xl items-center w-4/5 relative border-t-4 border-green-500">
            <Pressable
              className="bg-black/10 p-3 rounded-full absolute top-2 right-2"
              onPress={closeModal}
            >
              <Fontisto name="close-a" size={12} color="black" />
            </Pressable>
            <View className="w-full pt-6 items-center">
              <Fontisto name="check" size={32} color="#22c55e" />
              <Text className="text-sm font-semibold text-green-700 text-center mt-3">
                {description}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export function ConfirmBottomSheet({
  visible,
  title,
  description,
  confirmLabel = "Leave",
  cancelLabel = "Stay",
  onConfirm,
  onCancel,
}: ConfirmBottomSheetProps) {
  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["30%"], []);

  useEffect(() => {
    if (visible) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [visible]);

  const renderBackdrop = useCallback(
    (backdropProps: any) => (
      <BottomSheetBackdrop
        {...backdropProps}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
        opacity={0.5}
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      onDismiss={onCancel}
      enableDynamicSizing={false} // disables auto-resizing to content
      enableOverDrag={false} // prevents dragging above the snap point
      index={0} // always opens at the first (only) snap point
    >
      <BottomSheetView className="px-5 pt-4 pb-8 justify-evenly">
        <HeadingText text={title} />
        {description ? (
          <Text className="text-sm font-kanitMedium text-gray-500 text-center mb-6">
            {description}
          </Text>
        ) : null}
        <View className="flex-row items-center justify-center gap-3 w-full mt-7">
          <View className="w-[50%]">
            <SmallPrimaryButton buttonName={cancelLabel} onPress={onCancel} />
          </View>
          <View className="w-[50%]">
            <SmallGhostButton buttonName={confirmLabel} onPress={onConfirm} />
          </View>
        </View>
        <View className="mt-6">
          <Image
            source={require("../../../assets/images/blue_checker.png")}
            className="w-full h-7"
            resizeMode="contain"
          />
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

// â”€â”€â”€ ConfirmModal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function ConfirmModal({
  visible,
  title,
  description,
  confirmLabel = "Leave",
  cancelLabel = "Stay",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onCancel}
    >
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="bg-white p-6 rounded-2xl items-center w-4/5">
          <Text className="text-lg font-bold text-gray-900 text-center mb-2">
            {title}
          </Text>
          {description ? (
            <Text className="text-sm text-gray-500 text-center mb-6">
              {description}
            </Text>
          ) : null}
          <View className="flex-row gap-3 w-full">
            <Pressable
              onPress={onCancel}
              className="flex-1 rounded-lg px-4 py-3 bg-gray-100 items-center"
            >
              <Text className="font-bold text-gray-700">{cancelLabel}</Text>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              className="flex-1 rounded-lg px-4 py-3 bg-red-500 items-center"
            >
              <Text className="font-bold text-white">{confirmLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export function AuthRequiredBottomSheet({
  visible,
  title = "Create an account to continue",
  description = "Sign up to unlock this feature and enjoy the full BIGGS app experience.",
  ctaLabel = "Sign Up",
  onClose,
  onContinue,
}: AuthRequiredBottomSheetProps) {
  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["34%"], []);

  useEffect(() => {
    if (visible) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [visible]);

  const renderBackdrop = useCallback(
    (backdropProps: any) => (
      <BottomSheetBackdrop
        {...backdropProps}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
        opacity={0.5}
      />
    ),
    [],
  );

  const handleContinue = () => {
    onClose();
    if (onContinue) {
      onContinue();
      return;
    }

    router.push("/(auth)/login");
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      onDismiss={onClose}
      enableDynamicSizing={false}
      enableOverDrag={false}
      index={0}
    >
      <BottomSheetView className="px-5 pt-4 pb-8 justify-evenly">
        <HeadingText text={title} />
        <Text className="text-sm font-kanitMedium text-gray-500 text-center mb-6">
          {description}
        </Text>
        <View className="flex-row items-center justify-center gap-3 w-full mt-2">
          <View className="w-[50%]">
            <SmallGhostButton buttonName="Close" onPress={onClose} />
          </View>
          <View className="w-[50%]">
            <SmallPrimaryButton
              buttonName={ctaLabel}
              onPress={handleContinue}
            />
          </View>
        </View>
        <View className="mt-6">
          <Image
            source={require("../../../assets/images/blue_checker.png")}
            className="w-full h-7"
            resizeMode="contain"
          />
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}
