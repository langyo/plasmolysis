import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
  Paper,
  IconButton,
  Divider,
  Chip,
  TextField,
  Grid
} from '@material-ui/core';

import {
  ToggleButton,
  ToggleButtonGroup
} from '@material-ui/lab';

import Icon from '@mdi/react';
import {
  mdiContentSave,
  mdiClock,
  mdiFormatBold,
  mdiFormatItalic,
  mdiFormatUnderline,
  mdiPlus
} from '@mdi/js';

import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import ScrollArea from 'react-scrollbars-custom';
import dateFormat from 'dateformat';
import Immutable from 'immutable';

const UnstyledBlock = props => {
  const classes = makeStyles(theme => ({
    root: {
      fontSize: '1.5em'
    }
  }))();

  return <div className={classes.root}>{props.children}</div>;
};

export default props => {
  const classes = makeStyles(theme => ({
    root: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      overflow: 'hidden'
    },
    rootScroll: {
      width: '100%',
      height: '100%',
      overflow: 'auto'
    },
    content: {
      margin: theme.spacing(4),
      padding: theme.spacing(1),
      width: '80%',
      minWidth: 400,
      height: '100%',
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    textArea: {
      margin: theme.spacing(1),
      padding: theme.spacing(1)
    },
    divider: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2)
    },
    chip: {
      marginRight: theme.spacing(1),
      marginBottom: theme.spacing(1)
    }
  }))();

  const [isAddingTag, setAddingTag] = React.useState(false);
  const [newTagValue, setNewTagValue] = React.useState('');

  const [content, _setContent] = React.useState(props.content);
  const setContent = content => {
    _setContent(content);
    props.setContent(convertToRaw(content.getCurrentContent()));
  };

  return <div className={classes.root}>
    <ScrollArea mobileNative className={classes.rootScroll}>
      <div className={classes.content}>
        <TextField fullWidth label='标题' value={props.title} onChange={e => props.setTitle(e.target.value)} />
        <Divider className={classes.divider} />
        <Chip
          avatar={<Icon path={mdiClock} size={1} />}
          label={dateFormat(props.time, 'yy.m.d HH:MM')}
          onClick={() => { console.log(props) }}
          className={classes.chip}
        />
        {
          props.tags.map((tag, index) => <Chip
            label={tag}
            onDelete={() => {
              let t = [];
              for (let i = 0; i < props.tags.length; ++i) {
                if (i !== index) t.push(props.tags[i]);
              }
              props.setTags(t);
            }}
            className={classes.chip}
            key={index}
          />)
        }
        <IconButton className={classes.chip} size='small' onClick={() => setAddingTag(true)}>
          <Icon path={mdiPlus} size={1} />
        </IconButton>
        <Dialog open={isAddingTag} onClose={() => setAddingTag(false)}>
          <DialogTitle>{'添加标签'}</DialogTitle>
          <DialogContent>
            <TextField fullWidth label='标签名称' value={newTagValue} onChange={e => setNewTagValue(e.target.value)} />
          </DialogContent>
          <DialogActions>
            <Button
              color="primary"
              onClick={() => {
                setAddingTag(false);
                setNewTagValue('');
              }}
            >
              {'取消'}
            </Button>
            <Button
              color="primary"
              onClick={() => {
                setAddingTag(false);
                let t = newTagValue;
                props.setTags([...props.tags, t]);
                setNewTagValue('')
              }}
            >
              {'确认'}
            </Button>
          </DialogActions>
        </Dialog>
        <Divider className={classes.divider} />
        <ToggleButtonGroup>
          <ToggleButton
            value='bold'
            onClick={() => setContent(RichUtils.toggleInlineStyle(content, 'BOLD'))}
          >
            <Icon path={mdiFormatBold} size={1} />
          </ToggleButton>
          <ToggleButton
            value='italic'
            onClick={() => setContent(RichUtils.toggleInlineStyle(content, 'ITALIC'))}
          >
            <Icon path={mdiFormatItalic} size={1} />
          </ToggleButton>
          <ToggleButton
            value='underlined'
            onClick={() => setContent(RichUtils.toggleInlineStyle(content, 'UNDERLINE'))}
          >
            <Icon path={mdiFormatUnderline} size={1} />
          </ToggleButton>
        </ToggleButtonGroup>
        <Divider className={classes.divider} />
        <div className={classes.textArea}>
          <Editor
            editorState={content}
            onChange={setContent}
            handleKeyCommand={(command, editorState) => {
              const newState = RichUtils.handleKeyCommand(editorState, command);
              if (newState) {
                setContent(newState);
                return 'handled';
              }
              return 'not-handled';
            }}
            customStyleMap={{
              Bold: {
                fontWeight: '600',
              },
              Italic: {
                fontStyle: 'italic',
              },
            }}
            blockRenderMap={Immutable.Map({
              unstyled: {
                element: 'p',
                wrapper: <UnstyledBlock />
              }
            })}
          />
        </div>
      </div>
    </ScrollArea>
  </div>;
}