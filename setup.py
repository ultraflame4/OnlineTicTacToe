import setuptools


setuptools.setup(
    name="OnlineTicTacToe", # Replace with your own username
    version="1.0.0",
    author="ultraflame4",
    description="A hostable online multiplayer TicTacToe",
    url="https://github.com/ultraflame4/OnlineTicTacToe",
    packages=["OnlineTicTacToe","client_src","server_src"],
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires='>=3.9',
    install_requires=[
        "pygame"
        ]
)