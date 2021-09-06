import React from 'react'

// TODO: will come back to this later 
function SearchVideo() {
    return (
        <div>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                onFinish={handleFinish}
                onFinishFailed={handleFinishFailed}
                // onFieldsChange={handleFieldsChange}
                autoComplete="off"
            >
                <Form.Item
                    name="search"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input placeholder="Search..." />
                </Form.Item>
            </Form>
            <Row justify="center">
                {submitted &&
                    query.items.map((item, index) => {
                        return (
                            <Col span={12} flex="auto" className="gutter-row">
                                <div>
                                    <Card
                                        key={index}
                                        hover="true"
                                        title={item.title}
                                        style={classes.gridStyle}
                                        cover={<img alt="example" src={item.url} style={{ height: "100%" }} />}              >
                                        <Meta
                                            avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                            title={item.channelTitle}
                                        />
                                    </Card>
                                </div>
                            </Col>
                        )
                    })
                }

            </Row>

        </div>
    )
}

export default SearchVideo
