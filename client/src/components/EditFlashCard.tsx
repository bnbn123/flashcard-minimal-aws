import * as React from 'react'
import { Form, Button, TextArea } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import {
  getFlashCardById,
  getUploadUrl,
  patchFlashCard,
  uploadFile
} from '../api/flashcards-api'
import { History } from 'history'
import { FlashCard } from '../types/FlashCard'

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile
}

interface EditFlashCardProps {
  match: {
    params: {
      flashCardId: string
    }
  }
  auth: Auth
  history: History
}

interface EditFlashCardState {
  file: any
  uploadState: UploadState
  newFlashCardName: string
  newFlashCardDef: string
  flashCard: FlashCard
}

export class EditFlashCard extends React.PureComponent<
  EditFlashCardProps,
  EditFlashCardState
> {
  state: EditFlashCardState = {
    file: undefined,
    uploadState: UploadState.NoUpload,
    newFlashCardName: '',
    newFlashCardDef: '',
    flashCard: {
      flashCardId: '',
      flashCardDef: '',
      createdAt: '',
      name: '',
      dueDate: '',
      done: false,
      attachmentUrl: ''
    }
  }

  async componentDidMount() {
    try {
      const flashCardId = this.props.match.params.flashCardId // Provide the desired flashcard ID
      console.log(
        '🚀 ~ file: EditFlashCard.tsx:60 ~ componentDidMount ~ flashCardId:',
        flashCardId
      )
      const flashCard = await getFlashCardById(
        this.props.auth.getIdToken(),
        flashCardId
      ) // Call the API method
      this.setState({
        newFlashCardName: flashCard.name,
        newFlashCardDef: flashCard.flashCardDef,
        flashCard
      })
    } catch (error) {
      alert('Could not get Flash Card By Id')
    }
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newFlashCardName: event.target.value })
  }
  handleDefChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ newFlashCardDef: event.target.value })
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    const { file, newFlashCardDef, newFlashCardName } = this.state
    try {
      if (
        newFlashCardDef === this.state.flashCard.flashCardDef &&
        newFlashCardName === this.state.flashCard.name
      ) {
        alert('Enter something to both fields')
        return
      }

      //update card info

      await patchFlashCard(
        this.props.auth.getIdToken(),
        this.props.match.params.flashCardId,
        {
          name: newFlashCardName,
          flashCardDef: newFlashCardName,
          dueDate: this.state.flashCard.dueDate,
          done: this.state.flashCard.done
        }
      )
      alert('Flash card info updated')

      if (!file) {
        alert('No file selected')
        this.props.history.push('/')
      }

      this.setUploadState(UploadState.FetchingPresignedUrl)
      const uploadUrl = await getUploadUrl(
        this.props.auth.getIdToken(),
        this.props.match.params.flashCardId
      )

      this.setUploadState(UploadState.UploadingFile)
      await uploadFile(uploadUrl, this.state.file)

      alert('File was uploaded!')
      this.props.history.push('/')
    } catch (e) {
      alert('There was an error: ' + (e as Error).message)
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }
  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }

  render() {
    return (
      <div>
        <h1>Upload new image and Edit into Field</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Group>
            <Form.Input
              label="Word"
              placeholder="Word"
              name="name"
              value={this.state.newFlashCardName}
              onChange={this.handleNameChange}
            />
            <TextArea
              label="Word definition"
              placeholder="Add word definition"
              name="def"
              value={this.state.newFlashCardDef}
              onChange={this.handleDefChange}
              size="huge"
            />
          </Form.Group>
          <Form.Field>
            <label>File</label>
            <input
              type="file"
              accept="image/*"
              placeholder="Image to upload"
              onChange={this.handleFileChange}
            />
          </Form.Field>

          {this.renderButton()}
        </Form>
      </div>
    )
  }

  renderButton() {
    return (
      <div>
        {this.state.uploadState === UploadState.FetchingPresignedUrl && (
          <p>Uploading image metadata</p>
        )}
        {this.state.uploadState === UploadState.UploadingFile && (
          <p>Uploading file</p>
        )}
        <Button
          loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit"
        >
          Save All
        </Button>
        <Button onClick={() => this.props.history.goBack()}>Cancel</Button>
      </div>
    )
  }
}
