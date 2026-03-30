import { useEffect, useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";

interface InputProps {
  inputName: string;
  placeholder?: string;
  route?: any;
  icon?: any;
  icon2?: any;
  iconClickable?: boolean;
  inputWidth?: any;
  correctPin?: string;
  isDisabled?: boolean;
  isNumeric?: boolean;
  maxLength?: number;
  value?: string;
  onChangeText?: (text: string) => void;
  onFocus?: (boolean: boolean) => void;
}

export function LoginInput({
  inputName,
  icon,
  icon2,
  inputWidth,
  iconClickable,
  onChangeText,
}: InputProps) {
  const [text, setText] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="w-full items-center justify-center mb-3">
      <View style={{ width: inputWidth }} className="self-center">
        <Text className="text-sm font-medium text-gray-700 mb-1">
          {inputName}
        </Text>
        <View
          className={`flex-row items-center border-2 rounded-xl px-3 py-2 bg-slate-50
            ${isFocused ? "border-darkBlue bg-white" : "border-gray-200"}`}
        >
          <TextInput
            className="flex-1 ml-1 font-kanit text-base text-gray-900"
            placeholder={inputName}
            placeholderTextColor="#9ca3af"
            secureTextEntry={iconClickable && !isVisible}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChangeText={(newText) => {
              setText(newText);
              onChangeText?.(newText);
            }}
            value={text}
          />
          {!iconClickable ? (
            <View className="mr-1">{icon}</View>
          ) : (
            <Pressable onPress={() => setIsVisible((v) => !v)} className="mr-1">
              {isVisible ? icon : icon2}
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

export function NormalInput({
  inputName,
  placeholder,
  inputWidth,
  isDisabled,
  onChangeText,
  isNumeric,
  maxLength,
  value: controlledValue,
}: InputProps) {
  const isControlled = controlledValue !== undefined;
  const [text, setText] = useState("");
  const displayValue = isControlled ? controlledValue : text;
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="w-full items-center justify-center">
      <View style={{ width: inputWidth }} className="self-center">
        {inputName ? (
          <Text className="text-lg font-kanit text-darkBlue mb-1">
            {inputName}
          </Text>
        ) : null}

        <TextInput
          className={`
            w-full font-kanitBold text-2xl px-4 py-3 rounded-xl border-2
            ${
              isDisabled
                ? "bg-white border-gray-200 text-gray-900"
                : isFocused
                  ? "bg-white border-darkBlue text-gray-900"
                  : "bg-slate-50 border-gray-200 text-gray-900"
            }
          `}
          placeholder={placeholder}
          placeholderTextColor={isDisabled ? "#c0c0c0" : "#9ca3af"}
          editable={!isDisabled}
          selectTextOnFocus={!isDisabled}
          onFocus={() => {
            if (!isDisabled) setIsFocused(true);
          }}
          onBlur={() => setIsFocused(false)}
          onChangeText={(newText) => {
            if (!isDisabled) {
              let filtered = newText;
              if (isNumeric) {
                filtered = filtered.replace(/[^0-9]/g, "");
                if (maxLength) filtered = filtered.slice(0, maxLength);
              }
              if (!isControlled) setText(filtered);
              onChangeText?.(filtered);
            }
          }}
          value={displayValue}
          keyboardType={isNumeric ? "number-pad" : "default"}
        />
      </View>
    </View>
  );
}

const OTP_LENGTH = 6;

export function OTPInput({
  cellCount = OTP_LENGTH,
  value: valueProp,
  onChangeText,
  autoFocus = false,
}: {
  inputName?: string;
  cellCount?: number;
  /** Optional controlled value — when provided the parent owns the state. */
  value?: string;
  onChangeText?: (text: string) => void;
  autoFocus?: boolean;
}) {
  // If a controlled value is passed in, mirror it; otherwise manage internally.
  const isControlled = valueProp !== undefined;
  const [internalValue, setInternalValue] = useState("");
  const value = isControlled ? valueProp : internalValue;

  const codeFieldRef = useBlurOnFulfill({ value, cellCount });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue: isControlled ? () => {} : setInternalValue,
  });
  const hiddenInputRef = useRef<TextInput>(null);

  // Sync internal state when the controlled value is cleared externally (e.g. wrong OTP reset).
  useEffect(() => {
    if (isControlled) setInternalValue(valueProp);
  }, [isControlled, valueProp]);

  useEffect(() => {
    if (autoFocus) {
      const t = setTimeout(() => hiddenInputRef.current?.focus(), 150);
      return () => clearTimeout(t);
    } else {
      hiddenInputRef.current?.blur();
    }
  }, [autoFocus]);

  const handleChange = (text: string) => {
    if (!isControlled) setInternalValue(text);
    onChangeText?.(text);
  };

  return (
    <>
      <TextInput
        ref={hiddenInputRef}
        value={value}
        onChangeText={handleChange}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        style={{ position: "absolute", opacity: 0, height: 0, width: 0 }}
      />
      <CodeField
        ref={codeFieldRef}
        {...props}
        value={value}
        onChangeText={handleChange}
        cellCount={cellCount}
        rootStyle={{ marginTop: 20, marginLeft: "auto", marginRight: "auto" }}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoFocus={false}
        renderCell={({ index, symbol, isFocused }) => (
          <View
            onLayout={getCellOnLayoutHandler(index)}
            key={index}
            className={`w-11 h-14 justify-center items-center mx-1 border-b-2
              ${isFocused ? "border-blue-500" : "border-gray-300"}`}
          >
            <Text className="text-black text-3xl text-center font-kanitBold">
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          </View>
        )}
      />
    </>
  );
}

export function SearchInput({
  inputName,
  icon,
  inputWidth,
  onChangeText,
}: InputProps) {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="w-full items-center justify-center mb-3">
      <View style={{ width: inputWidth }} className="self-center">
        <View
          className={`flex-row items-center border-2 rounded-xl px-3
            ${isFocused ? "border-darkBlue bg-white" : "border-gray-200 bg-slate-50"}`}
        >
          <View className="ml-1">{icon}</View>
          <TextInput
            className="flex-1 ml-2 font-kanit text-lg text-gray-900 py-3"
            placeholder={inputName}
            placeholderTextColor="#9ca3af"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChangeText={(newText) => {
              setText(newText);
              onChangeText?.(newText);
            }}
            value={text}
          />
        </View>
      </View>
    </View>
  );
}
