import unittest

from fd import save_face
from fd import classify_face

class MyTestCase(unittest.TestCase):

    def test_save_face(self):
        self.assertEqual(save_face('models/Jack.npy','data/Jack.jpg'), True)

    def test_classify_face(self):
        self.assertEqual(classify_face('data/Jack.jpg'),'Jack')

if __name__ == '__main__':
    unittest.main()
