import React, { useState } from "react";
import axios from "axios";
import styled from "@emotion/styled";
import { useForm } from "react-hook-form";

// 스타일 정의
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: #f3f4f6;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  max-width: 600px;
  gap: 1rem;
  justify-content: space-between;
`;

const FormField = styled.div`
  flex: 0 0 48%;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
`;

const TextArea = styled.textarea`
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  height: 100px;
`;

const Button = styled.button`
  padding: 1rem;
  font-size: 1.2rem;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #0056b3;
  }
  &:disabled {
    background-color: #7aa9e8;
    cursor: not-allowed;
  }
`;

const ImageContainer = styled.div`
  margin-top: 2rem;
`;

const StyledImage = styled.img`
  max-width: 100%;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.9rem;
  margin: 0;
  margin-top: 0.25rem;
`;

const ResponseContainer = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
`;

const App = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      key: "a1y2PqCGPjzjwgb7lnWH7gdUE2l3CobiGkDcLzedwYJDAGIwM3yGSCiNgssj",
      prompt: ":A realistic photo of a model wearing a leather jacket.",
      negative_prompt: "Low quality, unrealistic, bad cloth, warped cloth",
      init_image: "https://ifh.cc/g/zsxGxD.jpg",
      cloth_image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi1fw2Ud60bvEelvhflX9E2fIoyt7N7S0R2Q&s",
      cloth_type: "upper_body",
      height: 709,
      width: 473,
      guidance_scale: 7.5,
      num_inference_steps: 21,
      seed: null,
      temp: "no",
      webhook: null,
      track_id: null,
    },
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [secondApiResponse, setSecondApiResponse] = useState(null);

  const onSubmit = async (data: unknown) => {
    setLoading(true);
    setError(null);
    setSecondApiResponse(null);
    try {
      // 첫 번째 API 호출
      const response = await axios.post(
        "https://stablediffusionapi.com/api/v5/fashion",
        data
      );
      if (response.data && response.data.result) {
        setImage(response.data.result);

        // 두 번째 API 호출
        const secondResponse = await axios.post(
          "https://modelslab.com/api/v3/fetch/5264",
          {
            key: data?.key,
          }
        );

        if (secondResponse.data) {
          setSecondApiResponse(secondResponse.data);
        }
      } else {
        setError("이미지를 가져오는 데 실패했습니다.");
      }
    } catch (err) {
      console.error(err);
      setError("오류가 발생했습니다.");
    }
    setLoading(false);
  };

  return (
    <Container>
      <Title>AI 이미지 생성기</Title>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormField>
          <Label htmlFor="key">API Key</Label>
          <Input
            id="key"
            type="text"
            placeholder="API Key"
            {...register("key", { required: "API Key is required" })}
          />
          {errors.key && <ErrorMessage>{errors.key.message}</ErrorMessage>}
        </FormField>

        <FormField>
          <Label htmlFor="prompt">Prompt</Label>
          <TextArea
            id="prompt"
            placeholder="Prompt"
            {...register("prompt", { required: "Prompt is required" })}
          />
          {errors.prompt && (
            <ErrorMessage>{errors.prompt.message}</ErrorMessage>
          )}
        </FormField>

        <FormField>
          <Label htmlFor="negative_prompt">Negative Prompt</Label>
          <TextArea
            id="negative_prompt"
            placeholder="Negative Prompt"
            {...register("negative_prompt")}
          />
        </FormField>

        <FormField>
          <Label htmlFor="init_image">Initial Image URL</Label>
          <Input
            id="init_image"
            type="text"
            placeholder="Initial Image URL"
            {...register("init_image", {
              required: "Initial Image URL is required",
              pattern: {
                value: /^(ftp|http|https):\/\/[^ "]+$/,
                message: "유효한 URL을 입력하세요.",
              },
            })}
          />
          {errors.init_image && (
            <ErrorMessage>{errors.init_image.message}</ErrorMessage>
          )}
        </FormField>

        <FormField>
          <Label htmlFor="cloth_image">Cloth Image URL</Label>
          <Input
            id="cloth_image"
            type="text"
            placeholder="Cloth Image URL"
            {...register("cloth_image", {
              required: "Cloth Image URL is required",
              pattern: {
                value: /^(ftp|http|https):\/\/[^ "]+$/,
                message: "유효한 URL을 입력하세요.",
              },
            })}
          />
          {errors.cloth_image && (
            <ErrorMessage>{errors.cloth_image.message}</ErrorMessage>
          )}
        </FormField>

        <FormField>
          <Label htmlFor="cloth_type">Cloth Type</Label>
          <Input
            id="cloth_type"
            type="text"
            placeholder="Cloth Type"
            {...register("cloth_type", { required: "Cloth type is required" })}
          />
          {errors.cloth_type && (
            <ErrorMessage>{errors.cloth_type.message}</ErrorMessage>
          )}
        </FormField>

        <FormField>
          <Label htmlFor="height">Height</Label>
          <Input
            id="height"
            type="number"
            placeholder="Height"
            {...register("height", {
              required: "Height is required",
              valueAsNumber: true,
              min: { value: 1, message: "Height는 1보다 커야 합니다." },
            })}
          />
          {errors.height && (
            <ErrorMessage>{errors.height.message}</ErrorMessage>
          )}
        </FormField>

        <FormField>
          <Label htmlFor="width">Width</Label>
          <Input
            id="width"
            type="number"
            placeholder="Width"
            {...register("width", {
              required: "Width is required",
              valueAsNumber: true,
              min: { value: 1, message: "Width는 1보다 커야 합니다." },
            })}
          />
          {errors.width && <ErrorMessage>{errors.width.message}</ErrorMessage>}
        </FormField>

        <FormField>
          <Label htmlFor="guidance_scale">Guidance Scale</Label>
          <Input
            id="guidance_scale"
            type="number"
            placeholder="Guidance Scale"
            step="0.1"
            {...register("guidance_scale", {
              required: "Guidance Scale is required",
              valueAsNumber: true,
              min: { value: 0, message: "Guidance Scale은 0보다 커야 합니다." },
            })}
          />
          {errors.guidance_scale && (
            <ErrorMessage>{errors.guidance_scale.message}</ErrorMessage>
          )}
        </FormField>

        <FormField>
          <Label htmlFor="num_inference_steps">Num Inference Steps</Label>
          <Input
            id="num_inference_steps"
            type="number"
            placeholder="Num Inference Steps"
            {...register("num_inference_steps", {
              required: "Num inference Steps is required",
              valueAsNumber: true,
              min: {
                value: 1,
                message: "Inference Steps는 1보다 커야 합니다.",
              },
            })}
          />
          {errors.num_inference_steps && (
            <ErrorMessage>{errors.num_inference_steps.message}</ErrorMessage>
          )}
        </FormField>

        <FormField>
          <Label htmlFor="seed">Seed (Optional)</Label>
          <Input
            id="seed"
            type="text"
            placeholder="Seed (Optional)"
            {...register("seed")}
          />
          {errors.seed && <ErrorMessage>{errors.seed.message}</ErrorMessage>}
        </FormField>

        <FormField>
          <Label htmlFor="temp">Temp</Label>
          <Input
            id="temp"
            type="text"
            placeholder="Temp"
            {...register("temp", {
              required: "Temp is required",
            })}
          />
          {errors.temp && <ErrorMessage>{errors.temp.message}</ErrorMessage>}
        </FormField>

        <FormField style={{ flex: "0 0 100%" }}>
          <Button type="submit" disabled={loading}>
            {loading ? "생성 중..." : "이미지 생성"}
          </Button>
        </FormField>
      </Form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {image && (
        <ImageContainer>
          <StyledImage src={image} alt="Generated Fashion Model" />
        </ImageContainer>
      )}
      {secondApiResponse && (
        <ResponseContainer>
          <h3>두 번째 API 응답:</h3>
          <pre>{JSON.stringify(secondApiResponse, null, 2)}</pre>
        </ResponseContainer>
      )}
    </Container>
  );
};

export default App;
