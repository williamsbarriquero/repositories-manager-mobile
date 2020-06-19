import React, { useState, useEffect } from "react";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import api from './services/api';

export default function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(async () => {
    const response = await api.get('/repositories');
    setRepositories(response.data);
  }, []);

  async function handleLikeRepository(id) {
    const response = await api.post(`/repositories/${id}/like`);

    const repositoryIndex = repositories.findIndex((r) => r.id === id);
    const repository = repositories.find((r) => r.id === id);
    const newRepository = {
      id: repository.id,
      title: repository.title,
      url: repository.url,
      techs: repository.techs,
      likes: response.data.likes,
    };
    repositories[repositoryIndex] = newRepository;
    setRepositories([...repositories]);
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#272727"  />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={repositories}
          keyExtractor={repository => repository.id}
          style={styles.repositoryContainer} 
          renderItem={({item: repository}) => (
            <>
              <Text style={styles.repository}>{repository.title}</Text>
              <View style={styles.techsContainer}>
                {repository.techs.map(tech => (
                  <Text style={styles.tech}>
                    {tech}
                  </Text>
                ))}
              </View>

              <View style={styles.likesContainer}>
                <Text
                  style={styles.likeText}
                  // Remember to replace "1" below with repository ID: {`repository-likes-${repository.id}`}
                  testID={`repository-likes-${repository.id}`}
                >
                  {repository.likes} curtidas
                </Text>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLikeRepository(repository.id)}
                // Remember to replace "1" below with repository ID: {`like-button-${repository.id}`}
                testID={`like-button-${repository.id}`}
              >
                <Text style={styles.buttonText}>Curtir</Text>
              </TouchableOpacity>
            </>
          )}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#272727",
    paddingTop: 20,
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#FFD4D4",
    padding: 20,
    borderRadius: 8
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#272727",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#FF858D",
    borderRadius: 50
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFD4D4",
    backgroundColor: "#FF858D",
    padding: 15,
    borderRadius: 5
  },
});
