import nltk
from nltk.corpus import stopwords
import spacy

# baixar stopwords na primeira vez
nltk.download("stopwords")

stop_words = set(stopwords.words("portuguese"))
nlp = spacy.load("pt_core_news_sm")


def preprocess_text(text: str) -> str:
    keep_tags = ['NOUN', 'PROPN', 'VERB', 'ADJ', 'ADV']
    doc = nlp(text.lower())

    tokens = []
    for token in doc:
        if token.lemma_ not in stop_words and not token.is_punct and not token.is_space and token.pos_ in keep_tags:
            tokens.append(token)

    return " ".join(tokens)
