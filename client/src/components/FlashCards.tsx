import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  Loader,
  Form,
  Message
} from 'semantic-ui-react'

import {
  createFlashCard,
  deleteFlashCard,
  getFlashCards,
  patchFlashCard
} from '../api/flashcards-api'
import Auth from '../auth/Auth'
import { FlashCard } from '../types/FlashCard'

interface FlashCardsProps {
  auth: Auth
  history: History
}

interface FlashCardsState {
  flashcards: FlashCard[]
  newFlashCardName: string
  newFlashCardDef: string
  loadingFlashcards: boolean
}

export class FlashCards extends React.PureComponent<
  FlashCardsProps,
  FlashCardsState
> {
  state: FlashCardsState = {
    flashcards: [],
    newFlashCardName: '',
    newFlashCardDef: '',
    loadingFlashcards: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newFlashCardName: event.target.value })
  }
  handleDefChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newFlashCardDef: event.target.value })
  }

  onEditButtonClick = (flashCardId: string) => {
    this.props.history.push(`/flashcards/${flashCardId}/edit`)
  }

  onFlashCardCreate = async () => {
    console.log(
      '🚀 ~ file: FlashCards.tsx:64 ~ onFlashCardCreate= ~ onFlashCardCreate:onClick'
    )

    try {
      const dueDate = this.calculateDueDate()
      const newFlashCard = await createFlashCard(this.props.auth.getIdToken(), {
        name: this.state.newFlashCardName,
        flashCardDef: this.state.newFlashCardDef,
        dueDate
      })
      this.setState({
        flashcards: [...this.state.flashcards, newFlashCard],
        newFlashCardName: '',
        newFlashCardDef: ''
      })
    } catch {
      alert('FlashCard creation failed')
    }
  }

  onFlashCardDelete = async (flashCardId: string) => {
    try {
      await deleteFlashCard(this.props.auth.getIdToken(), flashCardId)
      this.setState({
        flashcards: this.state.flashcards.filter(
          (flashcard) => flashcard.flashCardId !== flashCardId
        )
      })
    } catch {
      alert('FlashCard deletion failed')
    }
  }

  onFlashCardCheck = async (pos: number) => {
    try {
      const flashcard = this.state.flashcards[pos]
      await patchFlashCard(
        this.props.auth.getIdToken(),
        flashcard.flashCardId,
        {
          name: flashcard.name,
          flashCardDef: flashcard.flashCardDef,
          dueDate: flashcard.dueDate,
          done: !flashcard.done
        }
      )
      this.setState({
        flashcards: update(this.state.flashcards, {
          [pos]: { done: { $set: !flashcard.done } }
        })
      })
    } catch {
      alert('FlashCard deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const flashcards = await getFlashCards(this.props.auth.getIdToken())
      this.setState({
        flashcards,
        loadingFlashcards: false
      })
    } catch (e) {
      alert(`Failed to fetch flashcards: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">FlashCards</Header>

        {this.renderCreateFlashCardInput()}

        {this.renderFlashCardsList()}
      </div>
    )
  }

  renderCreateFlashCardInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Message>
            <Message.Header>Create Flash Cards</Message.Header>
            <p>
              Input the word you want to learn and revisit, then in put it's
              definition or summary
            </p>
          </Message>
          <Form size="large" onSubmit={this.onFlashCardCreate}>
            <Form.Group>
              <Form.Input
                placeholder="Word"
                name="name"
                value={this.state.newFlashCardName}
                onChange={this.handleNameChange}
              />
              <Form.Input
                placeholder="Add word definition"
                name="def"
                value={this.state.newFlashCardDef}
                onChange={this.handleDefChange}
              />

              <Form.Button type="submit">Add new flashcard</Form.Button>
            </Form.Group>
          </Form>
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderFlashCardsList() {
    if (this.state.loadingFlashcards) {
      return this.renderLoading()
    }

    return this.renderFlashCardsListList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading FlashCards
        </Loader>
      </Grid.Row>
    )
  }

  renderFlashCardsListList() {
    return (
      <Grid padded>
        {this.state.flashcards.map((FlashCard, pos) => {
          return (
            <Grid.Row key={FlashCard.flashCardId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onFlashCardCheck(pos)}
                  checked={FlashCard.done}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {FlashCard.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {FlashCard.dueDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(FlashCard.flashCardId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onFlashCardDelete(FlashCard.flashCardId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {FlashCard.attachmentUrl && (
                <Image src={FlashCard.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
