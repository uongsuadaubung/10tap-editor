import { Platform } from 'react-native';
import { Images } from '../../assets';
import { EditorActionType } from '../../types';
import type { EditorBridge } from '../../types';
import { type BridgeState } from '../../types';

export const ToolbarItems = {
  ...EditorActionType,
  ToggleH1: 'toggle-h1',
  ToggleH2: 'toggle-h2',
  ToggleH3: 'toggle-h3',
  ToggleH4: 'toggle-h4',
  ToggleH5: 'toggle-h5',
  ToggleH6: 'toggle-h6',
} as const;
export enum ToolbarContext {
  Main,
  Link,
  Heading,
  AI,
  Close,
  Image,
  Video,
  Record,
  Color,
  Font,
  Highlight,
}
type ArgsToolbarCB = {
  editor: EditorBridge;
  editorState: BridgeState;
  setToolbarContext: (
    ToolbarContext: ToolbarContext | ((prev: ToolbarContext) => ToolbarContext)
  ) => void;
  toolbarContext: ToolbarContext;
};

export interface ToolbarItem {
  onPress: ({ editor, editorState }: ArgsToolbarCB) => () => void;
  active: ({ editor, editorState }: ArgsToolbarCB) => boolean;
  disabled: ({ editor, editorState }: ArgsToolbarCB) => boolean;
  image: ({ editor, editorState }: ArgsToolbarCB) => any;
  context: ToolbarContext;
  title?: string;
}
const Bold: ToolbarItem = {
  onPress:
    ({ editor }) =>
    () =>
      editor.toggleBold(),
  active: ({ editorState }) => editorState.isBoldActive,
  disabled: ({ editorState }) => !editorState.canToggleBold,
  image: () => Images.bold,
  context: ToolbarContext.Main,
};

const Italic: ToolbarItem = {
  onPress:
    ({ editor }) =>
    () =>
      editor.toggleItalic(),
  active: ({ editorState }) => editorState.isItalicActive,
  disabled: ({ editorState }) => !editorState.canToggleItalic,
  image: () => Images.italic,
  context: ToolbarContext.Main,
};

const Link: ToolbarItem = {
  onPress:
    ({ setToolbarContext, editorState, editor }) =>
    () => {
      if (Platform.OS === 'android') {
        // On android focus outside the editor will lose the tiptap selection so we wait for the next tick and set it with the last selection value we had
        setTimeout(() => {
          editor.setSelection(
            editorState.selection.from,
            editorState.selection.to
          );
        });
      }
      setToolbarContext(ToolbarContext.Link);
    },
  active: ({ editorState }) => editorState.isLinkActive,
  disabled: ({ editorState }) =>
    !editorState.isLinkActive && !editorState.canSetLink,
  image: () => Images.link,
  context: ToolbarContext.Main,
};

const CheckList: ToolbarItem = {
  onPress:
    ({ editor }) =>
    () =>
      editor.toggleTaskList(),
  active: ({ editorState }) => editorState.isTaskListActive,
  disabled: ({ editorState }) => !editorState.canToggleTaskList,
  image: () => Images.checkList,
  context: ToolbarContext.Main,
};

const Heading: ToolbarItem = {
  onPress:
    ({ setToolbarContext }) =>
    () =>
      setToolbarContext(ToolbarContext.Heading),
  active: () => false,
  disabled: ({ editorState }) => !editorState.canToggleHeading,
  image: () => Images.Aa,
  context: ToolbarContext.Main,
};

const Code: ToolbarItem = {
  onPress:
    ({ editor }) =>
    () =>
      editor.toggleCode(),
  active: ({ editorState }) => editorState.isCodeActive,
  disabled: ({ editorState }) => !editorState.canToggleCode,
  image: () => Images.code,
  context: ToolbarContext.Main,
};
const Underline: ToolbarItem = {
  onPress:
    ({ editor }) =>
    () =>
      editor.toggleUnderline(),
  active: ({ editorState }) => editorState.isUnderlineActive,
  disabled: ({ editorState }) => !editorState.canToggleUnderline,
  image: () => Images.underline,
  context: ToolbarContext.Main,
};

const Strikethrough: ToolbarItem = {
  onPress:
    ({ editor }) =>
    () =>
      editor.toggleStrike(),
  active: ({ editorState }) => editorState.isStrikeActive,
  disabled: ({ editorState }) => !editorState.canToggleStrike,
  image: () => Images.strikethrough,
  context: ToolbarContext.Main,
};

const Quote: ToolbarItem = {
  onPress:
    ({ editor }) =>
    () =>
      editor.toggleBlockquote(),
  active: ({ editorState }) => editorState.isBlockquoteActive,
  disabled: ({ editorState }) => !editorState.canToggleBlockquote,
  image: () => Images.quote,
  context: ToolbarContext.Main,
};

const OrderedList: ToolbarItem = {
  onPress:
    ({ editor }) =>
    () =>
      editor.toggleOrderedList(),
  active: ({ editorState }) => editorState.isOrderedListActive,
  disabled: ({ editorState }) => !editorState.canToggleOrderedList,
  image: () => Images.orderedList,
  context: ToolbarContext.Main,
};
const BulletList: ToolbarItem = {
  onPress:
    ({ editor }) =>
    () =>
      editor.toggleBulletList(),
  active: ({ editorState }) => editorState.isBulletListActive,
  disabled: ({ editorState }) => !editorState.canToggleBulletList,
  image: () => Images.bulletList,
  context: ToolbarContext.Main,
};

const Sink: ToolbarItem = {
  // Regular list items (li) and task list items both use the
  // same sink command and button just with a different parameter, so we check both states here
  onPress:
    ({ editor, editorState }) =>
    () =>
      editorState.canSink ? editor.sink() : editor.sinkTaskListItem(),
  active: () => false,
  disabled: ({ editorState }) =>
    !editorState.canSink && !editorState.canSinkTaskListItem,
  image: () => Images.indent,
  context: ToolbarContext.Main,
};
const Lift: ToolbarItem = {
  // Regular list items (li) and task list items both use the
  // same lift command and button just with a different parameter, so we check both states here
  onPress:
    ({ editor, editorState }) =>
    () =>
      editorState.canLift ? editor.lift() : editor.liftTaskListItem(),
  active: () => false,
  disabled: ({ editorState }) =>
    !editorState.canLift && !editorState.canLiftTaskListItem,
  image: () => Images.outdent,
  context: ToolbarContext.Main,
};

const Undo: ToolbarItem = {
  onPress:
    ({ editor }) =>
    () =>
      editor.undo(),
  active: () => false,
  disabled: ({ editorState }) => !editorState.canUndo,
  image: () => Images.undo,
  context: ToolbarContext.Main,
};
const Redo: ToolbarItem = {
  onPress:
    ({ editor }) =>
    () =>
      editor.redo(),
  active: () => false,
  disabled: ({ editorState }) => !editorState.canRedo,
  image: () => Images.redo,
  context: ToolbarContext.Main,
};
export const DEFAULT_TOOLBAR_ITEMS: ToolbarItem[] = [
  Bold,
  Italic,
  Link,
  CheckList,
  Heading,
  Code,
  Underline,
  Strikethrough,
  Quote,
  OrderedList,
  BulletList,
  Sink,
  Lift,
  Undo,
  Redo,
];
const Close: ToolbarItem = {
  onPress:
    ({ setToolbarContext }) =>
    () =>
      setToolbarContext(ToolbarContext.Main),
  active: () => false,
  disabled: () => false,
  image: () => Images.close,
  context: ToolbarContext.Close,
};
const H1: ToolbarItem = {
  onPress:
    ({ editor }) =>
    () =>
      editor.toggleHeading(1),
  active: ({ editorState }) => editorState.headingLevel === 1,
  disabled: ({ editorState }) => !editorState.canToggleHeading,
  image: () => Images.h1,
  context: ToolbarContext.Heading,
};

const H2: ToolbarItem = {
  onPress:
    ({ editor }) =>
    () =>
      editor.toggleHeading(2),
  active: ({ editorState }) => editorState.headingLevel === 2,
  disabled: ({ editorState }) => !editorState.canToggleHeading,
  image: () => Images.h2,
  context: ToolbarContext.Heading,
};

const H3: ToolbarItem = {
  onPress:
    ({ editor }) =>
    () =>
      editor.toggleHeading(3),
  active: ({ editorState }) => editorState.headingLevel === 3,
  disabled: ({ editorState }) => !editorState.canToggleHeading,
  image: () => Images.h3,
  context: ToolbarContext.Heading,
};

const H4: ToolbarItem = {
  onPress:
    ({ editor }) =>
    () =>
      editor.toggleHeading(4),
  active: ({ editorState }) => editorState.headingLevel === 4,
  disabled: ({ editorState }) => !editorState.canToggleHeading,
  image: () => Images.h4,
  context: ToolbarContext.Heading,
};

const H5: ToolbarItem = {
  onPress:
    ({ editor }) =>
    () =>
      editor.toggleHeading(5),
  active: ({ editorState }) => editorState.headingLevel === 5,
  disabled: ({ editorState }) => !editorState.canToggleHeading,
  image: () => Images.h5,
  context: ToolbarContext.Heading,
};
const H6: ToolbarItem = {
  onPress:
    ({ editor }) =>
    () =>
      editor.toggleHeading(6),
  active: ({ editorState }) => editorState.headingLevel === 6,
  disabled: ({ editorState }) => !editorState.canToggleHeading,
  image: () => Images.h6,
  context: ToolbarContext.Heading,
};

export const HEADING_ITEMS: ToolbarItem[] = [Close, H1, H2, H3, H4, H5, H6];

export const ALL_TOOLBAR_ITEMS = [
  Close,
  ...DEFAULT_TOOLBAR_ITEMS,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
];

export const actions = {
  Bold: Bold,
  Italic: Italic,
  Link: Link,
  CheckList: CheckList,
  Heading: Heading,
  Code: Code,
  Underline: Underline,
  Strikethrough: Strikethrough,
  Quote: Quote,
  OrderedList: OrderedList,
  BulletList: BulletList,
  Sink: Sink,
  Lift: Lift,
  Undo: Undo,
  Redo: Redo,
  Close: Close,
  H1: H1,
  H2: H2,
  H3: H3,
  H4: H4,
  H5: H5,
  H6: H6,
};
