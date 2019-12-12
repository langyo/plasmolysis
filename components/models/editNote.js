import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Paper,
  Typography,
  IconButton,
  Divider,
  Chip,
  TextField,
  Fab
} from '@material-ui/core';

import {
  ToggleButton,
  ToggleButtonGroup
} from '@material-ui/lab';

import Icon from '@mdi/react';
import {
  mdiContentSave,
  mdiClose,
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
    title: {
      margin: theme.spacing(2),
      marginLeft: theme.spacing(2),
      marginBottom: 0
    },
    spacingRight: {
      right: theme.spacing(1),
      top: theme.spacing(1),
      position: 'absolute'
    },
    fab: {
      right: theme.spacing(6),
      bottom: theme.spacing(6),
      position: 'absolute'
    },
    content: {
      marginTop: 0,
      margin: theme.spacing(2),
      padding: theme.spacing(1)
    },
    textArea: {
      margin: theme.spacing(1),
      padding: theme.spacing(1),
      height: 300
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

  const [content, setContent] = React.useState(EditorState.createEmpty());
  const [title, setTitle] = React.useState(props.title || '');
  const [time, setTime] = React.useState(props.time || Date.now());

  const [tags, setTags] = React.useState(props.tags || ['默认收藏夹']);
  const [isAddingTag, setAddingTag] = React.useState(false);
  const [newTagValue, setNewTagValue] = React.useState('');

  const [isOpen, setOpen] = React.useState(true);
  const close = () => {
    setOpen(false);
    setTimeout(props.$destory, 500);
  }

  return [
    <Dialog
      open={isOpen}
      onClose={close}
      fullWidth
      maxWidth='xl'
    >
      <Typography variant='h6' className={classes.title}>
        编辑笔记
      </Typography>
      <IconButton color='inherit' onClick={close} className={classes.spacingRight}>
        <Icon path={mdiClose} size={1} />
      </IconButton>
      <Paper className={classes.content}>
        <TextField fullWidth label='标题' value={title} onChange={e => setTitle(e.target.value)} />
        <Divider className={classes.divider} />
        <Chip
          avatar={<Icon path={mdiClock} size={1} />}
          label={dateFormat(time, 'yy.m.d HH:MM')}
          onClick={() => { console.log(props) }}
          className={classes.chip}
        />
        {
          tags.map((tag, index) => <Chip
            label={tag}
            onDelete={() => {
              let t = [];
              for(let i = 0; i < tags.length; ++i) {
                if(i !== index) t.push(tags[i]);
              }
              setTags(t);
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
            <Button onClick={() => {
              setAddingTag(false);
              setNewTagValue('');
            }}>取消</Button>
            <Button onClick={() => {
              setAddingTag(false);
              let t = newTagValue;
              setTags([...tags, t]);
              setNewTagValue('')
            }}>确认</Button>
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
        <ScrollArea
          className={classes.textArea}
          style={{ height: 300 }}
        >
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
        </ScrollArea>
        <Fab className={classes.fab} color='primary' onClick={() => props.submit({
          id: props.id,
          title,
          tags: tags,
          content: JSON.stringify(convertToRaw(content.getCurrentContent()))
        })}>
          <Icon path={mdiContentSave} size={1} color='#fff' />
        </Fab>
      </Paper>
    </Dialog>
  ];
}