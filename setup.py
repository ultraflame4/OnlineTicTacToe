import setuptools


setuptools.setup(
    name="OnlineTicTacToe", # Replace with your own username
    version="2.0.0",
    author="ultraflame4",
    description="A hostable online multiplayer TicTacToe",
    url="https://github.com/ultraflame4/OnlineTicTacToe",
    packages=["OnlineTicTacToe","ott_client_src","ott_server_src"],
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires='>=3.8',
    install_requires=[
        ]
)