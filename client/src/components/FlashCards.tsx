/* eslint-disable no-lone-blocks */
import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Grid,
  Header,
  Icon,
  Loader,
  Form,
  Message,
  TextArea
} from 'semantic-ui-react'

import {
  createFlashCard,
  deleteFlashCard,
  getFlashCards,
  patchFlashCard
} from '../api/flashcards-api'
import Auth from '../auth/Auth'
import { FlashCard } from '../types/FlashCard'
import { FlipCard } from './FlipCard'

export interface FlashCardsProps {
  auth: Auth
  history: History
}

export interface FlashCardsState {
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
  handleDefChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ newFlashCardDef: event.target.value })
  }

  onEditButtonClick = (flashCardId: string) => {
    this.props.history.push(`/flashcards/${flashCardId}/edit`)
  }

  onFlashCardCreate = async () => {
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
        <Header as="h1">FlashCards Apps</Header>

        {this.renderCreateFlashCardInput()}

        {this.renderFlashCardsList()}
      </div>
    )
  }

  renderCreateFlashCardInput() {
    return (
      <Grid.Row>
        <Grid.Column>
          <Message>
            <Message.Header>Create Flash Cards</Message.Header>
            <p>
              Input the word you want to learn and revisit, then in put it's
              definition or summary
            </p>
          </Message>
          <Form
            size="large"
            onSubmit={this.onFlashCardCreate}
            className="create-form"
          >
            <Form.Group>
              <Form.Input
                label="Word"
                placeholder="Word"
                name="name"
                value={this.state.newFlashCardName}
                onChange={this.handleNameChange}
                size="big"
              />
              <Form.Field width="11">
                <label>Word definition</label>
                <TextArea
                  placeholder="Add word definition"
                  name="def"
                  value={this.state.newFlashCardDef}
                  onChange={this.handleDefChange}
                  size="huge"
                />
              </Form.Field>

              <Form.Button type="submit">Add new flashcard</Form.Button>
            </Form.Group>
          </Form>
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
      <div className="cards-container">
        {this.state.flashcards.map((flashcard, pos) => (
          <div>
            <FlipCard {...flashcard} />
            <div className="card-button-container">
              <div
                style={{
                  display: 'grid',
                  placeItems: 'center',
                  marginRight: '5px'
                }}
              >
                <label htmlFor={`Checkbox-${pos}`}>Done</label>
                <Checkbox
                  id={`Checkbox-${pos}`}
                  onChange={() => this.onFlashCardCheck(pos)}
                  checked={flashcard.done}
                />
              </div>
              <div>
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(flashcard.flashCardId)}
                >
                  <Icon name="pencil" />
                </Button>
              </div>
              <div>
                <Button
                  icon
                  color="red"
                  onClick={() => this.onFlashCardDelete(flashcard.flashCardId)}
                >
                  <Icon name="delete" />
                </Button>
              </div>
            </div>{' '}
          </div>
        ))}
      </div>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
