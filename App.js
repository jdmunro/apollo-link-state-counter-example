import React, { Component } from "react";
import { Button, Platform, StyleSheet, Text, View } from "react-native";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider, graphql } from "react-apollo";
import { withClientState } from "apollo-link-state";
import { ApolloLink } from "apollo-link";
import gql from "graphql-tag";

const cache = new InMemoryCache();

const stateLink = withClientState({
  cache,
  resolvers: {
    Mutation: {
      incrementCounter: (_, {}, { cache }) => {
        const data = {
          counter: {
            __typename: "Counter",
            value: 2
          }
        };

        cache.writeData({ data });

        return null;
      }
    }
  },
  defaults: {
    counter: {
      __typename: "Counter",
      value: 1
    }
  }
});

const client = new ApolloClient({
  cache,
  link: ApolloLink.from([stateLink, new HttpLink()])
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  counterText: {
    marginVertical: 8,
    fontWeight: "bold",
    fontSize: 22
  }
});

const IncrementButton = graphql(gql`
  mutation incrementCounter {
    incrementCounter @client
  }
`)(
  class extends Component {
    onIncrementPressed = () => {
      this.props.mutate({});
    };

    render() {
      return <Button title="Increment" onPress={this.onIncrementPressed} />;
    }
  }
);

const Counter = graphql(gql`
  {
    counter @client {
      value
    }
  }
`)(
  class extends Component {
    onIncrementPressed = () => {
      this.props.mutate({});
    };

    render() {
      return (
        <View style={styles.container}>
          <Text style={styles.counterText}>{`Counter: ${
            this.props.data.counter.value
          }`}</Text>
          <IncrementButton />
        </View>
      );
    }
  }
);

export default class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Counter />
      </ApolloProvider>
    );
  }
}
