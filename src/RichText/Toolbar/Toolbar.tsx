import {
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  View,
  Text,
} from 'react-native';
import { useBridgeState } from '../useBridgeState';
import React, { useMemo } from 'react';
import {
  actions,
  ALL_TOOLBAR_ITEMS,
  ToolbarContext,
  type ToolbarItem,
} from './actions';
import { EditLinkBar } from './EditLinkBar';
import { useKeyboard } from '../../utils';
import type { EditorBridge } from '../../types';

interface ToolbarProps {
  editor: EditorBridge;
  hidden?: boolean;
  items?: ToolbarItem[];
}

export const toolbarStyles = StyleSheet.create({});

export function Toolbar({
  editor,
  hidden = undefined,
  items = ALL_TOOLBAR_ITEMS,
}: ToolbarProps) {
  const editorState = useBridgeState(editor);
  const { isKeyboardUp } = useKeyboard();
  const [toolbarContext, setToolbarContext] = React.useState<ToolbarContext>(
    ToolbarContext.Main
  );
  const flatListRef = React.useRef<FlatList<ToolbarItem>>(null);
  const hideToolbar =
    hidden === undefined ? !isKeyboardUp || !editorState.isFocused : hidden;

  const args = {
    editor,
    editorState,
    setToolbarContext,
    toolbarContext,
  };
  const scrollToTop = () => {
    if (!flatListRef.current) {
      return;
    }
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({ index: 0, animated: true });
    }, 100);
  };
  const data = useMemo<ToolbarItem[]>(() => {
    const filteredItems = items.filter((i) => i.context === toolbarContext);

    let finalItems: ToolbarItem[];
    if (toolbarContext === ToolbarContext.Main) {
      finalItems = filteredItems;
    } else if (toolbarContext === ToolbarContext.Link) {
      finalItems = [];
    } else {
      finalItems = [actions.Close, ...filteredItems];
    }
    if (finalItems.length > 0) {
      scrollToTop();
    }
    return finalItems;
  }, [items, toolbarContext]);

  const isUseFlatList = useMemo<boolean>(() => {
    return [
      ToolbarContext.Main,
      ToolbarContext.Close,
      ToolbarContext.AI,
      ToolbarContext.Color,
      ToolbarContext.Image,
      ToolbarContext.Heading,
      ToolbarContext.Highlight,
    ].includes(toolbarContext);
  }, [toolbarContext]);

  if (isUseFlatList) {
    return (
      <FlatList
        ref={flatListRef}
        data={data}
        style={[
          editor.theme.toolbar.toolbarBody,
          hideToolbar ? editor.theme.toolbar.hidden : undefined,
        ]}
        renderItem={({
          item: { onPress, disabled, active, image, title, iconStyle },
        }) => {
          return (
            <TouchableOpacity
              onPress={onPress(args)}
              disabled={disabled(args)}
              style={[editor.theme.toolbar.toolbarButton]}
            >
              <View
                style={[
                  editor.theme.toolbar.iconWrapper,
                  active(args)
                    ? editor.theme.toolbar.iconWrapperActive
                    : undefined,
                  disabled(args)
                    ? editor.theme.toolbar.iconWrapperDisabled
                    : undefined,
                ]}
              >
                <Image
                  source={image(args)}
                  style={[
                    editor.theme.toolbar.icon,
                    active(args) ? editor.theme.toolbar.iconActive : undefined,
                    disabled(args)
                      ? editor.theme.toolbar.iconDisabled
                      : undefined,
                    iconStyle,
                  ]}
                  resizeMode="contain"
                />
                {title ? (
                  <Text style={[editor.theme.toolbar.textTitle]}>{title}</Text>
                ) : null}
              </View>
            </TouchableOpacity>
          );
        }}
        horizontal
      />
    );
  } else if (toolbarContext === ToolbarContext.Link) {
    return (
      <EditLinkBar
        theme={editor.theme}
        initialLink={editorState.activeLink}
        onBlur={() => setToolbarContext(ToolbarContext.Main)}
        onLinkIconClick={() => {
          setToolbarContext(ToolbarContext.Main);
          editor.focus();
        }}
        onEditLink={(link) => {
          editor.setLink(link);
          editor.focus();

          if (Platform.OS === 'android') {
            // On android we dont want to hide the link input before we finished focus on editor
            // Add here 100ms and we can try to find better solution later
            setTimeout(() => {
              setToolbarContext(ToolbarContext.Main);
            }, 100);
          } else {
            setToolbarContext(ToolbarContext.Main);
          }
        }}
      />
    );
  } else {
    return null;
  }
}
